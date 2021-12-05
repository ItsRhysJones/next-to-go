import GetApiPayload, { PayloadSchema } from "../services/dataDownload"

export const TOGGLE_CATEGORY = "TOGGLE_CATEGORY"
export const CLEAR_CATEGORIES = "CLEAR_CATEGORIES"
export const UPDATE_RACE_DATA_ITEMS = "UPDATE_RACE_DATA_ITEMS"
export const UPDATE_TIMERS = "UPDATE_TIMERS"

export type CategoryAction = {
    type: string,
    categoryId: string
}

export type PayloadAction = {
    type: string,
    payload: PayloadSchema
}

/** Toggles the category's 'selected' property
* @param categoryId The ID of the category to toggle
*/
export const toggleCategoryFilter = (categoryId: string) => {
    let action: CategoryAction = { type: TOGGLE_CATEGORY, categoryId: categoryId }
    return action
}

/** Sets all category 'selected' property to false
*/
export const clearCategoryFilters = () => {
    let action: CategoryAction = { type: CLEAR_CATEGORIES, categoryId: "" }
    return action
}

/** Increments timer/count down on races and performs cleanup of old races
*/
export const incrementRaceCountDowns = () => {
    let action = { type: UPDATE_TIMERS }
    return action
}

/** Calls Api to retreive race data items 
 */
export async function initRaceDataApi(dispatch: CallableFunction) {
    try {
        let payload = await GetApiPayload()
        console.log("Payload received")
        if (payload.status.toString()[0] != '2') {            
            console.log(`Error ${payload.status} - ${payload.message}`)
            return false;
        }
        dispatch(updateRaceDataItems(payload))
        return true
    }
    catch (error) {
        console.log(error)
        return false
    }
}

export const updateRaceDataItems = (payload: PayloadSchema) => {
    let action: PayloadAction = { type: UPDATE_RACE_DATA_ITEMS, payload: payload }
    return action
}
