import { Category, CategoryData, CATEGORY_LOOKUP, HIDE_TIME_DELAY, MAX_DISPLAYABLE_RACES, RaceData, UNKOWN_CATEGORY } from "../resources/definitions";
import { PayloadSchema } from "../services/dataDownload";
import { AddRaceIfMissing, CleanupExpiredRaces, ProcessRaceDataPayload, ProcessRaceSummary, RaceSummarySchema, ResolveCategory, ResolveRaces } from "../store/reducers";

function getTimeNowSeconds(): number {
    let now = new Date()
    return Math.round(now.getTime() / 1000)
}

function getRandomString() {
    let result = '';
    let chars = '%*!.?&@#$=+0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 15; i > 0; --i)
        result += chars[getRandomInt(chars.length)];
    return result
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
}

function getMockRaceData(
    raceId: string = getRandomString(),
    categoryId: string = getRandomString(),
    startOffset: number = getRandomInt(120) - 60,
): RaceData {
    return ProcessRaceSummary(getMockRaceSummarySchema(raceId, categoryId, startOffset))
}

function getMockRaceSummarySchema(
    raceId: string = getRandomString(),
    categoryId: string = getRandomString(),
    startOffset: number = getRandomInt(120) - 60,
): RaceSummarySchema {

    return {
        race_id: raceId,
        race_name: "Mohawk Pace Ms",
        race_number: 5,
        meeting_name: "Mohawk",
        category_id: categoryId,
        advertised_start: {
            seconds: getTimeNowSeconds() + startOffset
        },
    }
}

function getMockPayloadSchema(): PayloadSchema {
    return {
        status: 200,
        message: "Mock message",
        data: {
            next_to_go_ids: [
                "randomDynamicKey1",
                "randomDynamicKey2",
            ],
            race_summaries: {
                randomDynamicKey1: {
                    ...getMockRaceSummarySchema("randomDynamicKey1")
                },
                randomDynamicKey2: {
                    ...getMockRaceSummarySchema("randomDynamicKey2")
                },
            }
        }
    }
}

test('ProcessRaceSummary should convert RaceSummarySchema to valid RaceData', () => {
    let mockSummary = getMockRaceSummarySchema()
    let raceData = ProcessRaceSummary(mockSummary)

    expect(mockSummary.race_id).toBe(raceData.RaceId)
    expect(mockSummary.advertised_start.seconds).toBe(raceData.AdvertisedStart)
})

test('AddRaceIfMissing should convert and add RaceSummarySchema as a valid RaceData to given array', () => {
    let mockSummary = getMockRaceSummarySchema()

    let raceDataItems: Array<RaceData> = []
    AddRaceIfMissing(mockSummary, raceDataItems)

    expect(raceDataItems.length).toBe(1)
    expect(mockSummary.race_id).toBe(raceDataItems[0].RaceId)
    expect(mockSummary.advertised_start.seconds).toBe(raceDataItems[0].AdvertisedStart)
})

test('AddRaceIfMissing should NOT add an existing RaceData item', () => {
    let mockSummary = getMockRaceSummarySchema()

    let raceDataItems: Array<RaceData> = []
    AddRaceIfMissing(mockSummary, raceDataItems)
    AddRaceIfMissing(mockSummary, raceDataItems)

    expect(raceDataItems.length).toBe(1)
    expect(mockSummary.race_id).toBe(raceDataItems[0].RaceId)
    expect(mockSummary.advertised_start.seconds).toBe(raceDataItems[0].AdvertisedStart)
})

test('AddRaceIfMissing should add RaceData items in order by AdvertisedStart', () => {
    let mockSummaries: Array<RaceSummarySchema> = []
    for (let i = 0; i < 30; i++) {
        mockSummaries.push(getMockRaceSummarySchema())
    }

    let raceDataItems: Array<RaceData> = []

    mockSummaries.forEach((r) => AddRaceIfMissing(r, raceDataItems))

    expect(raceDataItems.length).toBe(30)

    for (let i = 1; i < 30; i++) {
        expect(raceDataItems[i - 1].AdvertisedStart <= raceDataItems[i].AdvertisedStart).toBe(true)
    }
})

test('ProcessRaceDataPayload should extract and add RaceData from PayloadSchema', () => {
    let mockPayload = getMockPayloadSchema()

    let raceDataItems: Array<RaceData> = []
    ProcessRaceDataPayload(raceDataItems, mockPayload)

    expect(raceDataItems.length).toBe(2)

    mockPayload.data.next_to_go_ids.forEach((id) => {
        expect(raceDataItems.findIndex((r) => r.RaceId === id) != -1).toBe(true)
    })
})


test('ProcessRaceDataPayload should add to existing RaceData from PayloadSchema', () => {
    let mockPayload = getMockPayloadSchema()

    let raceDataItems: Array<RaceData> = [getMockRaceData(), getMockRaceData()]
    ProcessRaceDataPayload(raceDataItems, mockPayload)

    expect(raceDataItems.length).toBe(4)

    mockPayload.data.next_to_go_ids.forEach((id) => {
        expect(raceDataItems.findIndex((r) => r.RaceId === id) != -1).toBe(true)
    })
})


test('ProcessRaceDataPayload should add to existing RaceData from PayloadSchema', () => {
    let mockPayload = getMockPayloadSchema()

    let raceDataItems: Array<RaceData> = [getMockRaceData(), getMockRaceData()]
    ProcessRaceDataPayload(raceDataItems, mockPayload)

    expect(raceDataItems.length).toBe(4)

    mockPayload.data.next_to_go_ids.forEach((id) => {
        expect(raceDataItems.findIndex((r) => r.RaceId === id) != -1).toBe(true)
    })
})

test('ResolveCategory should update Category List', () => {
    let categories: Array<Category> = []
    let count = 0

    CATEGORY_LOOKUP.forEach(category => {
        ResolveCategory(category.CategoryId, categories)
        count++
        expect(categories.length).toBe(count)
        expect(categories.findIndex((r) => r.Data.Name === category.Name) != -1).toBe(true)
    })
})

test('ResolveCategory should not add repeated Categories', () => {
    let categories: Array<Category> = []

    let categoryData = CATEGORY_LOOKUP[0]

    ResolveCategory(categoryData.CategoryId, categories)
    ResolveCategory(categoryData.CategoryId, categories)
    expect(categories.length).toBe(1)
})

test('ResolveCategory should add "Unkown" category for undocumented categories only once', () => {
    let categories: Array<Category> = []
    ResolveCategory(getRandomString(), categories)
    ResolveCategory(getRandomString(), categories)
    expect(categories.length).toBe(1)
    expect(categories[0].Data.CategoryId).toBe(UNKOWN_CATEGORY)
})

test('ResolveRaces should generate valid Race items from RaceData and Categories', () => {
    let categories: Array<Category> = []
    let raceDataItems: Array<RaceData> = []

    for (let i = 0; i < 4; i++) {
        raceDataItems.push(getMockRaceData())
    }

    let races = ResolveRaces(raceDataItems, categories)
    expect(races.length).toBe(4)
    raceDataItems.forEach((d) => {
        expect(races.findIndex((r) => r.Data.RaceId === d.RaceId) != -1).toBe(true)
    })
})

test('ResolveRaces should generate no more than the MAX number of races', () => {
    let categories: Array<Category> = []
    let raceDataItems: Array<RaceData> = []

    for (let i = 0; i < 20; i++) {
        raceDataItems.push(getMockRaceData())
    }

    let races = ResolveRaces(raceDataItems, categories)
    expect(races.length).toBe(MAX_DISPLAYABLE_RACES)
})

test('ResolveRaces should only show races from selected categories', () => {
    let categories: Array<Category> = []
    CATEGORY_LOOKUP.forEach(category => {
        ResolveCategory(category.CategoryId, categories)
    })

    let raceDataItems: Array<RaceData> = []
    for (let i = 0; i < 40; i++) {
        raceDataItems.push(
            getMockRaceData(
                getRandomString(),
                CATEGORY_LOOKUP[getRandomInt(CATEGORY_LOOKUP.length)].CategoryId
            )
        )
    }

    const check_categories = (raceDataItems: Array<RaceData>, categories: Array<Category>) => {
        let races = ResolveRaces(raceDataItems, categories)
        expect(races.length).toBe(MAX_DISPLAYABLE_RACES)
        races.forEach((r) => {
            expect(categories.find((c) => c.Data.CategoryId === r.Category.CategoryId)?.Selected).toBe(true)
        })
    }

    // First selcted Categories
    categories.forEach((r) => r.Selected == false)
    categories[0].Selected = true
    check_categories(raceDataItems, categories)

    // Second selected Categories
    categories.forEach((r) => r.Selected == false)
    categories[1].Selected = true
    check_categories(raceDataItems, categories)

    // One unselected Categories
    categories.forEach((r) => r.Selected == true)
    categories[0].Selected = false
    check_categories(raceDataItems, categories)

    // All selected Categories
    categories.forEach((r) => r.Selected == true)
    check_categories(raceDataItems, categories)
})

test('CleanupExpiredRaces should remove races with expired times that are more than the threshold', () => {

    let raceDataItems: Array<RaceData> = []
    for (let i = 0; i < 40; i++) {
        raceDataItems.push(
            getMockRaceData(
                getRandomString(),
                getRandomString(),
                getRandomInt(5000) - 2500
            )
        )
    }

    let timeSeconds = getTimeNowSeconds()
    CleanupExpiredRaces(raceDataItems)

    raceDataItems.forEach((r)=> {
        expect(timeSeconds - r.AdvertisedStart < HIDE_TIME_DELAY ).toBe(true)
    })
})

test('CleanupExpiredRaces allowes for races within threshold time after expiration to remain.', () => {

    let raceDataItems: Array<RaceData> = []
    let timeSeconds = getTimeNowSeconds()
    
    HIDE_TIME_DELAY / 10

    for (let i = 0; i < 20; i++) {
        raceDataItems.push(
            getMockRaceData(
                getRandomString(),
                getRandomString(),
                timeSeconds - 25 + (i*10) 
            )
        )
    }

    CleanupExpiredRaces(raceDataItems)

    raceDataItems.forEach((r)=> {
        expect(timeSeconds - r.AdvertisedStart < HIDE_TIME_DELAY ).toBe(true)
    })
})