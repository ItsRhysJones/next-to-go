// Type definitions and global variables used across components and services

// Additional category used if undocumented categories are returned in API call.
export const UNKOWN_CATEGORY = "Unkown"

// Time delay after a race is satrted before it is removed from view
export const HIDE_TIME_DELAY = 60

// Endpoint url to retreive data
export const ENDPOINT_URL = "https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10"

// Category field definition (Populated by endpoint / Data Service)
export type CategoryData = {
    CategoryId: string,
    Name: string,
}

// Race field definitions (Populated by endpoint/ Data Service)
export type RaceData = {
    RaceId: string,
    RaceName: string, // Displayable
    RaceNumber: number, // Displayable
    AdvertisedStart: number, // Displayable (after formatting)
    CategoryId: string,
    MeetingId: string,
    MeetingName: string // Displayable
}

// Race definition, used between components and services
export type Race = {
    Data: RaceData,
    Category: CategoryData,
    CountDown: number,
    Started: boolean,
}

// Category definition, used between components and services
export type Category = {
    Data: CategoryData,
    Selected: boolean,
}

// Documented categories
export const GategoryLookup: Array<CategoryData> = [
    {
        CategoryId: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
        Name: "Greyhound",
    },
    {
        CategoryId: '161d9be2-e909-4326-8c2c-35ed71fb460b',
        Name: "Harness",
    },
    {
        CategoryId: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
        Name: "Horse",
    },
]