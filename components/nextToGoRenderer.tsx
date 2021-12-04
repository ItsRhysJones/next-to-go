import React, { useState } from "react"
import { Component } from "react"
import { View, Text, Pressable } from "react-native"
import { Category, Race } from "../resources/definitions"
import RaceInfoList from './raceList'
import CategoryFilter from './categoryFilter'

type RendererState = {
    races: Array<Race>,
    categories: Array<Category>,
}

function Renderer() {

    // Mock Data - To Be Deleted
    let defaultState: RendererState = {
        races: [
            {
                Data: {
                    RaceId: "race1",
                    RaceName: "Race 1",
                    RaceNumber: 1,
                    AdvertisedStart: 1638669000,
                    CategoryId: "category1",
                    MeetingId: "meet1",
                    MeetingName: "Meet 1"
                },
                Category: {
                    CategoryId: "category1",
                    Name: "Category 1",
                },
                Started: false,
                CountDown: 123,
            },
            {
                Data: {
                    RaceId: "race2",
                    RaceName: "Race 2",
                    RaceNumber: 2,
                    AdvertisedStart: 1638668820,
                    CategoryId: "category1",
                    MeetingId: "meet2",
                    MeetingName: "Meet 2"
                },
                Category: {
                    CategoryId: "category2",
                    Name: "Category 2",
                },
                Started: true,
                CountDown: -3601,
            }
        ],
        categories: [
            {
                Data: {
                    CategoryId: "category2",
                    Name: "Category 2",
                },
                Selected: true,
            },
            {
                Data: {
                    CategoryId: "category1",
                    Name: "Category 1",
                },
                Selected: false,
            }
        ],
    }

    const [races, setRaces] = useState<Array<Race>>(defaultState.races);
    const [categories, setCategories] = useState<Array<Category>>(defaultState.categories);

    /** Toggles the category's 'selected' property
     * @param categoryId The ID of the category to toggle
     */
    const toggleCategoryFilter = (categoryId: string) => {
        let updatedCategories = [...categories];

        // Get corresponding category
        let matchingCategory = updatedCategories.filter((r) => r.Data.CategoryId === categoryId);
        if (matchingCategory.length == 1) {
            // Flip 'Selected' value and update state
            matchingCategory[0].Selected = !matchingCategory[0].Selected
            setCategories(updatedCategories)
        }
    }

    /** Sets all category 'selected' property to false
     */
    const clearCategoryFilters = () => {
        let updatedCategories = [...categories];

        updatedCategories.forEach((r)=> r.Selected = false)
        setCategories(updatedCategories)
    }


    return (
        <View>
            <CategoryFilter categories={categories} onPress={toggleCategoryFilter} clearAction={clearCategoryFilters}/>
            <RaceInfoList races={races} />
        </View>
    )

}


export default Renderer