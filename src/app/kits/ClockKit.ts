import {useEffect, useState} from "react";

export class ClockKit {
  getTicker(duration = 1) {
    const [clock, setClock] = useState(0)

    useEffect(() => {
      let tick = 0

      const interval = setInterval(() => {
        setClock(tick++)
      }, 1000 * duration)

      return () => clearInterval(interval)
    }, []);

    return clock
  }
}

export const $clockKit = new ClockKit()