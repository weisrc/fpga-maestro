import { ref } from "@swrf/core";
import { Midi } from "@tonejs/midi";
import { PreviewData } from "./types";

export const midi = ref<Midi | null>(null);
export const playing = ref(false);
export const currentTick = ref(0);
export const tickPerPixel = ref(10);
export const tickPerUnit = ref(240);
export const tickOffset = ref(0);
export const noteSilence = ref(0);
export const previewWidth = ref(0);
export const previewScroll = ref(0);
export const previewScrollMax = ref(0);
export const scrollFollow = ref(false);
export const previewData = ref<PreviewData | null>(null);
