// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import VideoStreamProcessorStage from "./VideoStreamProcessorStage";

/**
 *
 */
export default interface VideoStreamProcessor {
  /**
   *
   */
  setInputMediaStream(stream: MediaStream): void;

  /**
   *
   */
  getInputMediaStream(): MediaStream;

  /**
   *
   */
  getOutputMediaStream(): MediaStream;

  /**
   *
   */
  setStages(stages: VideoStreamProcessorStage[]): void;

  /**
   *
   */
  getStages(): VideoStreamProcessorStage[];

  /**
   *
   */
  setFramerate(framerate: number): void;
}
