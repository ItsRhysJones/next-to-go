import { combineReducers } from "redux";
import { Category, CategoryData, CATEGORY_LOOKUP, HIDE_TIME_DELAY, MAX_DISPLAYABLE_RACES, Race, RaceData, StoredState, UNKOWN_CATEGORY } from "../resources/definitions";
import { PayloadSchema } from "../services/dataDownload";
import { CLEAR_CATEGORIES, TOGGLE_CATEGORY, UPDATE_RACE_DATA_ITEMS, UPDATE_TIMERS } from "./actions";

const initialState: StoredState = {
    RaceDataItems: [],
    Races: [],
    Categories: [],
}

export type RaceSummarySchema = {
    race_id: string,
    race_name: string
    race_number: number
    meeting_name: string
    category_id: string
    advertised_start: {
        seconds: number
    }
}

/** Reducer used to update Redux Store
 * @param state initial and existing state
 * @param action action { type: string, ... }
 * @returns state to internal Redux workings.
 */
export const nextToGoReducer = (state = initialState, action: any) => {
    let updatedCategories: Array<Category> = []
    let updatedRaces: Array<Race> = []
    let updatedRaceDataItems: Array<RaceData> = []

    switch (action.type) {

        case TOGGLE_CATEGORY:
            // Get corresponding category
            let categoryIdx = state.Categories.findIndex((r) => r.Data.CategoryId === action.categoryId);
            if (categoryIdx != -1) {
                // Flip 'Selected' value and update state
                updatedCategories = [...state.Categories];
                updatedCategories[categoryIdx].Selected = !updatedCategories[categoryIdx].Selected
                updatedRaces = ResolveRaces(state.RaceDataItems, updatedCategories)
                return { ...state, Categories: updatedCategories, Races: updatedRaces };
            }
            break;

        case CLEAR_CATEGORIES:
            // Set all category 'Selected' value to false
            updatedCategories = [...state.Categories];
            updatedCategories.forEach((r) => r.Selected = false);
            updatedRaces = ResolveRaces(state.RaceDataItems, updatedCategories)
            return { ...state, Categories: updatedCategories, Races: updatedRaces };

        case UPDATE_RACE_DATA_ITEMS:
            // Process payload then update state
            updatedCategories = [...state.Categories]
            updatedRaceDataItems = [...state.RaceDataItems]
            ProcessRaceDataPayload(updatedRaceDataItems, action.payload as PayloadSchema)
            CleanupExpiredRaces(updatedRaceDataItems)
            updatedRaces = ResolveRaces(updatedRaceDataItems, updatedCategories)
            return {
                ...state,
                RaceDataItems: updatedRaceDataItems,
                Categories: updatedCategories,
                Races: updatedRaces
            };

        case UPDATE_TIMERS:
            updatedRaceDataItems = [...state.RaceDataItems]
            updatedCategories = [...state.Categories]
            CleanupExpiredRaces(updatedRaceDataItems)
            updatedRaces = ResolveRaces(updatedRaceDataItems, updatedCategories)
            return {
                ...state,
                RaceDataItems: updatedRaceDataItems,
                Categories: updatedCategories,
                Races: updatedRaces
            };

        default:
            return state;
    }
}


/** Removes RaceData items where time elapsed after start time exceeds the HIDE_TIME_DELAY
 * @param raceDataItems Items to filter
 * @returns returns filtered list
 */
 export function CleanupExpiredRaces(raceDataItems: Array<RaceData>): Array<RaceData> {
    let now = new Date()
    let epochSeconds = Math.round(now.getTime() / 1000)

    let deleteList = raceDataItems.filter((r) => r.AdvertisedStart - epochSeconds < HIDE_TIME_DELAY)
    deleteList.forEach((d) => raceDataItems.splice(raceDataItems.findIndex((r) => d.RaceId === r.RaceId), 1))

    return raceDataItems
}

/** Generates displayable races from Categories and RaceDataItems
 * @param raceDataItems 
 * @param categories If categories are marked selected, only they are shown, else all are shown
 * @returns Array of displayable races
 */
 export function ResolveRaces(raceDataItems: Array<RaceData>, categories: Array<Category>): Array<Race> {
    let races: Array<Race> = []
    let categoryIds: Array<string> = []
    categories.forEach((category) => {
        if (category.Selected) {
            categoryIds.push(category.Data.CategoryId)
        }
    })

    let now = new Date()
    let epochSeconds = Math.round(now.getTime() / 1000)

    raceDataItems.filter((raceData) => {
        if (races.length < MAX_DISPLAYABLE_RACES
            && (categoryIds.length == 0
                || categoryIds.includes(raceData.CategoryId))) {
            races.push({
                Data: raceData,
                Category: ResolveCategory(raceData.CategoryId, categories),
                CountDown: raceData.AdvertisedStart - epochSeconds,
                Started: epochSeconds - raceData.AdvertisedStart > 0
            })
        }
    })

    return races
}


/** Finds existing or documented category. Adds category as a filter item if missing
 * Also adds the "unknown" category if the id is not a known valid category id
 * @param categoryId ID of the category
 * @param categories existing array of categories
 * @returns CategoryData item
 */
 export function ResolveCategory(categoryId: string, categories: Array<Category>): CategoryData {
    // If we already have the category as a displayable item, return it.
    let categoryIdx = categories.findIndex((r: Category) => r.Data.CategoryId === categoryId)
    if (categoryIdx != -1) {
        return categories[categoryIdx].Data
    }

    // If the category is missing from displayable items, look it up
    categoryIdx = CATEGORY_LOOKUP.findIndex((r: CategoryData) => r.CategoryId === categoryId)
    if (categoryIdx != -1) {
        let category: Category = {
            Data: CATEGORY_LOOKUP[categoryIdx],
            Selected: false
        }
        categories.push(category)
        return category.Data
    }

    // If there is no category, check for the "unkown" category
    categoryIdx = categories.findIndex((r: Category) => r.Data.CategoryId === UNKOWN_CATEGORY)
    if (categoryIdx != -1) {
        let category: Category = {
            Data: categories[categoryIdx].Data,
            Selected: false
        }
        return category.Data
    }

    // Create the "unkown" category
    let category: Category = {
        Data: {
            CategoryId: UNKOWN_CATEGORY,
            Name: "Unkown"
        },
        Selected: false
    }
    categories.push(category)
    return category.Data
}

/** Processes payload schema
 * @param raceDataItems existing array of race data items
 * @param payload api payload as PayloadSchema
 * @returns 
 */
export function ProcessRaceDataPayload(raceDataItems: Array<RaceData>, payload: PayloadSchema): Array<RaceData> {
    for (const key in payload.data.race_summaries) {
        let summaryItem = payload.data.race_summaries[key] as RaceSummarySchema
        AddRaceIfMissing(summaryItem, raceDataItems)
    }

    return raceDataItems
}


/** Checks race in array and adds it from raw data if missing
 * @param summary raw data
 * @param races existing array of races
 * @param categories existing array of categories
 * @returns nothing
 */
 export function AddRaceIfMissing(summary: RaceSummarySchema, raceDataItems: Array<RaceData>) {
    let raceIdx = raceDataItems.findIndex((r: RaceData) => r.RaceId === summary.race_id)
    // If existing, no action required
    if (raceIdx != -1) return

    let raceData = ProcessRaceSummary(summary)

    // Array is in order of AdvertisedStart - New item is inserted accordingly
    let insertIndex = raceDataItems.findIndex((r: RaceData) => r.AdvertisedStart > raceData.AdvertisedStart)
    if (insertIndex == -1) {
        insertIndex = raceDataItems.length
    }
    raceDataItems.splice(insertIndex, 0, raceData)
}

/** Casts a raceSummarySchema item to a RaceData item
 * @param summary raceSummarySchema item
 * @returns RaceData item
 */
export function ProcessRaceSummary(summary: RaceSummarySchema): RaceData {
    let raceData: RaceData = {
        RaceId: summary.race_id,
        RaceName: summary.race_name, // Displayable
        RaceNumber: summary.race_number, // Displayable
        AdvertisedStart: summary.advertised_start.seconds, // Displayable (after formatting)
        CategoryId: summary.category_id,
        MeetingName: summary.meeting_name // Displayable
    }
    return raceData;
}

const rootReducer = combineReducers({
    Data: nextToGoReducer,
})

export default rootReducer