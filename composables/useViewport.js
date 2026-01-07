const DESKTOP_WIDTH = 1180

export function useViewport() {
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  const isMobile = computed(() => {
    return windowWidth.value < 768
  })

  const isMedium = computed(() => {
    return windowWidth.value >= 768 && windowWidth.value < DESKTOP_WIDTH
  })

  const isDesktop = computed(() => {
    return windowWidth.value >= DESKTOP_WIDTH
  })

  const isDesktopWide = computed(() => {
    return windowWidth.value >= 1280
  })

  const isLandscape = computed(() => {
    return windowWidth.value > windowHeight.value
  })

  const isPortrait = computed(() => {
    return windowWidth.value < windowHeight.value
  })

  return {
    isMobile,
    isMedium,
    isDesktop,
    isDesktopWide,
    isLandscape,
    isPortrait,
  }
}
