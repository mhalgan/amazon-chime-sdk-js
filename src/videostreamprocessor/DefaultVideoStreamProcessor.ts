// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import Logger from '../logger/Logger';
import VideoStreamProcessor from "./VideoStreamProcessor";
import VideoStreamProcessorStage from './VideoStreamProcessorStage';

export interface CanvasElement extends HTMLCanvasElement {
    captureStream(frameRate?: number): void;
  }

/**
 * 
 */
export default class DefaultVideoStreamProcessor implements VideoStreamProcessor {
    private static defaultFramerate = 15;

    private mediaStreamInput: MediaStream | null;
    private videoInput: HTMLVideoElement = document.createElement('video');
    // Alias for this.videoInput.videoHeight and this.videoInput.videoHeight;
    // updated if necessary every process call
    private videoHeight: number = 0;
    private videoWidth: number = 0;

    private canvasOutput: HTMLCanvasElement = document.createElement('canvas');
    private canvasOutputCtx: CanvasRenderingContext2D = this.canvasOutput.getContext('2d');
    private canvasInput: HTMLCanvasElement = document.createElement('canvas')
    private canvasInputCtx: CanvasRenderingContext2D = this.canvasInput.getContext('2d');

    private targetFramerate: number = DefaultVideoStreamProcessor.defaultFramerate;
    private stages: VideoStreamProcessorStage[] = [];

    constructor(private logger: Logger) {}
    
    setInputMediaStream(mediaStreamInput: MediaStream): void {
        this.mediaStreamInput = mediaStreamInput;
        if (!this.mediaStreamInput) {
            this.logger.warn("Pausing video input");
            this.videoInput.removeEventListener("canplay", this.processVideo);
            this.videoInput.srcObject = null;
            this.videoInput.pause();
            return;
        }
        if (this.mediaStreamInput.getVideoTracks().length == 0) {
            this.logger.error("No video tracks in input media stream, ignoring");
            return;
        }
        this.logger.warn("Setting input media stream");

        this.videoInput.addEventListener("canplay", this.processVideo, false);
        this.videoInput.srcObject = this.mediaStreamInput;
        this.videoInput.play();
    }

    getInputMediaStream(): MediaStream {
        return this.mediaStreamInput;
    }

    getOutputMediaStream(): MediaStream {
        let mediaStream = (<CanvasElement>this.canvasOutput).captureStream()
        return <MediaStream><unknown>mediaStream;
    }

    setStages(stages: VideoStreamProcessorStage[]): void {
        this.stages = stages;
    }

    getStages(): VideoStreamProcessorStage[] {
        return this.stages;
    }

    setFramerate(framerate: number): void {
        this.targetFramerate = framerate;
    }

    private processVideo = (_event: Event) => {
        if (!this.videoInput.srcObject) {
            this.logger.warn("no more srcObject");
            return;
        }
        if (this.videoWidth != this.videoInput.videoWidth
            || this.videoHeight != this.videoInput.videoWidth) {
            // Update aliases
            this.videoWidth = this.videoInput.videoWidth;
            this.videoHeight = this.videoInput.videoHeight;
            // Update input and output canvas dimensions
            // otherwise drawn images will be cropped
            this.canvasInput.width = this.videoWidth;
            this.canvasInput.height = this.videoHeight;
            this.canvasOutput.width = this.videoWidth;
            this.canvasOutput.height = this.videoHeight;
        }

        this.canvasInputCtx.drawImage(this.videoInput, 0, 0, this.videoWidth, this.videoHeight);
        let processedCanvas: HTMLCanvasElement = this.canvasInput;
        this.logger.warn("Process");

        for (const stage of this.stages) {
            this.logger.warn("ProcessLoops");

            processedCanvas = stage.processCanvas(processedCanvas);
        }
        this.canvasOutputCtx.drawImage(processedCanvas, 0, 0, this.videoWidth, this.videoHeight);

        setTimeout(this.processVideo, 1000 / this.targetFramerate);
    }
}
