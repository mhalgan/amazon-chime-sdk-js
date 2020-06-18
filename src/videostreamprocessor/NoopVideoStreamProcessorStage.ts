// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import VideoStreamProcessorStage from "./VideoStreamProcessorStage";

/**
 * 
 */
export default class NoOpVideoStreamProcessorStage implements VideoStreamProcessorStage {
    processCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
        return canvas;
    }
}
