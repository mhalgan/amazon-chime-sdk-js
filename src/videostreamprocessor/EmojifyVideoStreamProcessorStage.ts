// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import VideoStreamProcessorStage from "./VideoStreamProcessorStage";

/**
 * 
 */
export default class EmojifyVideoStreamProcessorStage implements VideoStreamProcessorStage {
    private x: number = 0;
    private y: number = 0;

    processCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
      let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
      if (this.x > canvas.width) {
          this.x = Math.floor(Math.random() * canvas.width);
      } else if (this.y > canvas.height) {
        this.x = Math.floor(Math.random() * canvas.width);
        this.y = 0;
      }
      this.y += 5;

      ctx.font = '50px serif'
      ctx.fillText('😜', this.x, this.y)
      return canvas;
  }
}
