import React from "react"
import { API_CALL_TIME_DELAY } from "../resources/definitions"


type ClockProps = {
    updateSecondAction: CallableFunction
    callApiAction: CallableFunction
}

type ClockState = {
    seconds: number
}

class Clock extends React.Component<ClockProps, ClockState> {
    interval!: NodeJS.Timer

    constructor(props: ClockProps) {
        super(props)
        this.state = {
            seconds: 0
        }
    }

    increment = () => {
        let newStateSeconds = this.state.seconds + 1

        this.props.updateSecondAction()

        if (newStateSeconds > API_CALL_TIME_DELAY) {
            newStateSeconds = 0
            this.props.callApiAction()
        }

        this.setState({
            seconds: newStateSeconds
        });

    }

    componentDidMount() {
        this.interval = setInterval(this.increment, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return <></>
    }
}

export default Clock