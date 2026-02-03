export const EVENTS = Object.freeze({
  RESTART: 'restart',
  BACK: 'back',

  WEBGL_READY: 'webglReady',

  ANIMATE_IN_INTRO: 'animateInIntro',
  ANIMATE_OUT_INTRO_SHAPE: 'animateOutIntro',

  ANIMATE_IN_MAIN_SCENE: 'animateInMainScene',

  EXPERIENCE_STEP_02_POSITION_TRACK_START: 'experienceStep02PositionTrackStart',
  EXPERIENCE_STEP_02_POSITION_TRACK_COMPLETE: 'experienceStep02PositionTrackComplete',
  EXPERIENCE_STEP_02_DOT_ANIMATE_IN_COMPLETE: 'experienceStep02DotAnimateInComplete',

  EXPERIENCE_END_DRAW_ANIMATION_START: 'experienceEndDrawAnimationStart',
  EXPERIENCE_END_DRAW_ANIMATION_COMPLETE: 'experienceEndDrawAnimationComplete',

  TRIGGER_FLASH_EFFECT: 'triggerFlashEffect',

  TOGGLE_LANGUAGE_SELECTOR: 'toggleLanguageSelector',
})

export const AUDIO_LABELS = Object.freeze({
  BASE_LOOP: 'baseLoop',
  CAMPAIGN_LOOP: 'campaignLoop',
  SFX_TRANSITION: 'sfxTransition',
  SFX_CLICK: 'sfxClick',
  SFX_END_SHAPE: 'sfxEndShape',
  SFX_STEP_01_ANIMATE_IN: 'sfxStep01AnimateIn',
  SFX_STEP_02_ANIMATE_IN: 'sfxStep02AnimateIn',
  SFX_STEP_03_ANIMATE_IN: 'sfxStep03AnimateIn'
})

export const STORAGE_LABELS = Object.freeze({
  PRINT_ENABLED: 'printEnabled',
})

export const ENGAGEMENT_DISABLED_LOCALES = Object.freeze(['es'])
