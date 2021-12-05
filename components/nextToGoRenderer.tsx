import React, { useEffect, useState } from "react"
import { View, ActivityIndicator, StyleSheet, Text, Button } from "react-native"
import RaceInfoList from './raceList'
import CategoryFilter from './categoryFilter'
import { incrementRaceCountDowns, initRaceDataApi } from "../store/actions";
import { useDispatch } from "react-redux";
import Clock from "./clock";
import { Theme } from "../resources/globalStyles";

function Renderer() {

    const [isLoading, setLoading] = useState<boolean>(true)
    const [isError, setIsError] = useState<boolean>(false)
    const [retry, setRetry] = useState<boolean>(true)

    const dispatch = useDispatch();

    useEffect(() => {
        const loadData = async () => {
            let success = await initRaceDataApi(dispatch)
            setLoading(false)
            setIsError(!success)
        }
        loadData()
    }, [dispatch, retry])

    const updateSecondAction = () => {
        dispatch(incrementRaceCountDowns())
    }

    const triggerRetry = () => {
        setLoading(true)
        setIsError(false)
        setRetry(!retry)
    }

    if (isLoading)
        return (
            <View style={localStyles.ActivityIndicator}>
                <ActivityIndicator size="large" color={Theme.btnColourNormal} />
            </View>
        )

    if (isError)
        return (
            <View style={localStyles.RetryMenuOuter}>
                <View style = {localStyles.RetryMenuInner}><Text style={localStyles.Message}>There was a problem loading data.</Text></View>
                <View style = {localStyles.RetryMenuInner}><Button color={Theme.btnColourNormal} onPress={triggerRetry} title="Retry"/></View>
            </View>
        )

    return (
        <View>
            <CategoryFilter />
            <RaceInfoList />
            <Clock updateSecondAction={updateSecondAction} callApiAction={() => initRaceDataApi(dispatch)} />
        </View>
    )
}

const localStyles = StyleSheet.create({
    // Filter Bar
    ActivityIndicator: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: "100%",
        width: "100%",
    },
    RetryMenuOuter: {
        flexDirection: 'column',
        height: "100%",
        width: "100%",
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    RetryMenuInner: {
        width: "80%",
        margin: 5,
        alignItems: 'center',
    },
    Message: {
        color: Theme.BodyColourText,
        fontSize: Theme.FontSizeSubHeading,
    },
})


export default Renderer