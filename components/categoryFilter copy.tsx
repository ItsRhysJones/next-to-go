import React, { useState } from "react"
import { View, Text, TouchableOpacity, Button, Pressable, } from "react-native"
import { Category } from "../resources/definitions"
import { StyleSheet, Modal } from "react-native"
import { Theme } from "../resources/globalStyles"

type CategoryFilterProps = {
    categories: Array<Category>,
    onPress: CallableFunction
}

function CategoryFilter(props: CategoryFilterProps) {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    }

    /** Renders all categories in a "Filter Bar" as buttons
     * @param categories an array of categories
     * @returns Rendered Filter Bar containing buttons
     */
    const renderFilter = (categories: Array<Category>) => {
        return (
            <View>
                <Button title="Filter" onPress={toggleIsOpen} />
                
                    <Modal visible={isOpen} animationType="slide" style={{width: 200, maxWidth: "60%"}}>
                    <Pressable onPress={toggleIsOpen}>
                        <View style={filterStyles.FilterPanel}>
                            <Text>Race Categories</Text>
                            {
                                categories.map(category => (
                                    renderCategory(category)
                                ))
                            }
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
        return <TouchableOpacity key={category.Data.CategoryId} onPress={() => props.onPress(category.Data.CategoryId)}
            style={category.Selected ? filterStyles.FilterBtnToggle : filterStyles.FilterBtn}>
            <Text style={category.Selected ? filterStyles.FilterBtnToggleText : filterStyles.FilterBtnText}>{category.Data.Name}</Text>
        </TouchableOpacity>
    }

    return (renderFilter(props.categories))
}

const filterStyles = StyleSheet.create({
    FilterPanel: {
        backgroundColor: Theme.Body2ndColour,
        padding: 5,
        alignItems: "center",
        justifyContent: "space-between",
    },
    FilterBtn: {
        backgroundColor: Theme.btnColourNormal,
        padding: 5,
        borderRadius: 10,
        margin: 5,
    },
    FilterBtnToggle: {
        backgroundColor: Theme.btnColourToggle,
        padding: 5,
        borderRadius: 10,
        margin: 5,
    },
    FilterBtnText: {
        color: Theme.btnColourNormalText,
        fontWeight: 'bold'
    },
    FilterBtnToggleText: {
        color: Theme.btnColourToggleText,
    }
})

export default CategoryFilter