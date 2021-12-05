import React, { useState } from "react"
import { View, Text, TouchableOpacity, Button, Pressable } from "react-native"
import { Category, RootReducer } from "../resources/definitions"
import { StyleSheet, Modal, Switch } from "react-native"
import { Theme } from "../resources/globalStyles"
import { useSelector, useDispatch } from "react-redux"
import { clearCategoryFilters, toggleCategoryFilter } from "../store/actions"

function CategoryFilter() {

    const categories = useSelector((state: RootReducer) => state.Data.Categories)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    }

    const dispatch = useDispatch();

    /** Toggles the category's 'selected' property
     * @param categoryId The ID of the category to toggle
     */
     const CategoryOnPress = (categoryId: string) => {
        dispatch(toggleCategoryFilter(categoryId))
    }

    /** Sets all category 'selected' property to false
     */
    const ClearOnPress = () => {
        dispatch(clearCategoryFilters())
    }

    /** Renders all categories in a "Filter Bar" as buttons
     * @param categories an array of categories
     * @returns Rendered Filter Bar containing buttons
     */
    const renderFilter = (categories: Array<Category>) => {
        return (
            <View>
                <View style={localStyles.FilterBar}>
                    <View style={localStyles.FilterButton}>
                        <Button title="Filter" onPress={toggleIsOpen} color={Theme.btnColourNormal} />
                    </View>
                    <View style={localStyles.FilterButton}>
                        <Button title="Clear Filter" onPress={() => ClearOnPress()}
                            color={Theme.btnColourNormal} />
                    </View>
                </View>

                <Modal visible={isOpen} animationType="fade" transparent={true}>
                    <Pressable onPress={toggleIsOpen} style={localStyles.ModalBackdrop}>
                    </Pressable>
                </Modal>

                <Modal visible={isOpen} animationType="slide" transparent={true} >
                    <Pressable style={localStyles.ModalPopup} onPress={toggleIsOpen}>
                        <View style={localStyles.ModalBody}>
                            <Text style={localStyles.ModalTitle}>Race Categories</Text>
                            <View>{
                                categories.map(category => (
                                    renderCategory(category)
                                ))
                            }</View>
                            <View style={localStyles.ClearButton}>
                                <Button title="Clear Filter" onPress={() => ClearOnPress()}
                                    color={Theme.btnColourNormal} />
                            </View>
                        </View>
                    </Pressable>
                </Modal>

            </View>
        )
    }

    /** Renders a single category button
     * @param category a single category
     * @returns Rendered button
     */
    const renderCategory = (category: Category) => {
        return <TouchableOpacity
            key={category.Data.CategoryId}
            onPress={() => CategoryOnPress(category.Data.CategoryId)}
            style={localStyles.CategoryItem}
        >
            <Switch
                trackColor={{ false: Theme.BodyColour, true: Theme.HeaderColour }}
                thumbColor={Theme.btnColourNormal}
                onChange={() => CategoryOnPress(category.Data.CategoryId)}
                value={category.Selected}
            />
            <Text style={localStyles.CategoryItemText}>{category.Data.Name}</Text>
        </TouchableOpacity>
    }

    return (renderFilter(categories))
}

const localStyles = StyleSheet.create({
    // Filter Bar
    FilterBar: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-evenly',
    },
    FilterButton: {
        flex: 1,
        alignContent: 'center',
        width: "100%",
        fontSize: Theme.FontSizeSubHeading

    },

    // Modal / Pop-up
    ModalBackdrop: {
        backgroundColor: "rgba(0,0,0,0.5)",
        flex: 1,
    },
    ModalPopup: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: "100%",
        width: "100%",
    },
    ModalBody: {
        backgroundColor: Theme.Body2ndColour,
        padding: 10,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: 'space-between',
        minHeight: "40%",
        minWidth: "70%",
    },
    ModalTitle: {
        fontSize: Theme.FontSizeHeading,
        color: Theme.BodyColourText
    },
    ClearButton: {
        alignContent: 'center',
        width: "80%",
        fontSize: Theme.FontSizeSubHeading
    },

    // Category Items
    CategoryItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        width: "50%",
        margin: 10,
    },
    CategoryItemText: {
        color: Theme.BodyColourText,
        fontSize: Theme.FontSizeSubHeading
    },
})

export default CategoryFilter