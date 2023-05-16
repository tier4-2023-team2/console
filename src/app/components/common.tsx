
export const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export const APPBAR_HEIGHT: Number = 68;
export const STATIC_COMPONENT_SIZE: any = {
    appbar: {
        width: null,
        height: APPBAR_HEIGHT
    }
}

export const DEFAULT_SYSTEM_CONF: any = {
    workspace: "",
    vehicle_model: "",
    sensor_model: "",
    launch_prefix: "",
    launch_suffix: "",
}