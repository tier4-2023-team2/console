
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