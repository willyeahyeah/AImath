// Visual Mathematics Engine - SVG renderer for fraction visualizations
// Deterministic, math-safe rendering

import { 
  VisualObject, 
  AnimationAction, 
  LessonScene 
} from '@/types';
import { Rational } from './rational';
import React from 'react';

export interface RenderContext {
  currentTimeMs: number;
  reducedMotion: boolean;
}

export class VisualMathEngine {
  /**
   * Math-safety gate: validate all objects before rendering
   */
  static validateScene(scene: LessonScene): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const obj of scene.objects) {
      // Skip validation for label objects without meaningful math
      if (obj.type === 'label' && obj.math.denominator === 1) {
        continue;
      }

      // Check denominator
      if (obj.math.denominator <= 0) {
        errors.push(`Object ${obj.id}: denominator must be > 0`);
      }

      // Check numerator/denominator are integers
      if (!Number.isInteger(obj.math.numerator) || !Number.isInteger(obj.math.denominator)) {
        errors.push(`Object ${obj.id}: numerator and denominator must be integers`);
      }

      // Check shade count
      if (obj.type === 'fractionBar' || obj.type === 'fractionCircle') {
        if (obj.math.numerator > obj.math.denominator) {
          // Allow for now but could warn
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Render a fraction bar as SVG
   */
  static renderFractionBar(
    obj: VisualObject,
    ctx: RenderContext
  ): React.ReactElement {
    const { math, layout, style } = obj;
    const { numerator, denominator } = math;
    const { x, y, w, h } = layout;

    const partWidth = w / denominator;
    const parts: React.ReactElement[] = [];

    // Fill colors based on role
    const fillColors = {
      A: '#2563EB',
      B: '#EA580C',
      sum: '#7C3AED',
      neutral: '#E5E7EB',
    };
    const fillColor = fillColors[style?.fillRole || 'neutral'];
    const emptyColor = '#F3F4F6';

    for (let i = 0; i < denominator; i++) {
      const isShaded = i < numerator;
      const fill = isShaded ? fillColor : emptyColor;
      const strokeColor = '#9CA3AF';

      parts.push(
        React.createElement('rect', {
          key: `part-${i}`,
          x: x + i * partWidth,
          y,
          width: partWidth,
          height: h,
          fill,
          stroke: strokeColor,
          strokeWidth: 2,
        })
      );
    }

    return React.createElement('g', { key: obj.id, id: obj.id }, ...parts);
  }

  /**
   * Render a number line as SVG
   */
  static renderNumberLine(
    obj: VisualObject,
    ctx: RenderContext
  ): React.ReactElement {
    const { layout } = obj;
    const { x, y, w, h } = layout;

    const lineY = y + h / 2;

    return React.createElement(
      'g',
      { key: obj.id, id: obj.id },
      // Main line
      React.createElement('line', {
        x1: x,
        y1: lineY,
        x2: x + w,
        y2: lineY,
        stroke: '#374151',
        strokeWidth: 2,
      }),
      // Start marker
      React.createElement('circle', {
        cx: x,
        cy: lineY,
        r: 4,
        fill: '#374151',
      }),
      // End marker
      React.createElement('circle', {
        cx: x + w,
        cy: lineY,
        r: 4,
        fill: '#374151',
      })
    );
  }

  /**
   * Render a label as SVG text
   */
  static renderLabel(
    obj: VisualObject,
    ctx: RenderContext,
    text?: string
  ): React.ReactElement {
    const { layout, math } = obj;
    const { x, y, w, h } = layout;

    const displayText = text || 
      (math.denominator === 1 ? '' : `${math.numerator}/${math.denominator}`);

    return React.createElement(
      'text',
      {
        key: obj.id,
        id: obj.id,
        x: x + w / 2,
        y: y + h / 2,
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        fontSize: '20px',
        fontWeight: 'bold',
        fill: '#1F2937',
      },
      displayText
    );
  }

  /**
   * Render a single visual object
   */
  static renderObject(
    obj: VisualObject,
    ctx: RenderContext
  ): React.ReactElement | null {
    switch (obj.type) {
      case 'fractionBar':
        return this.renderFractionBar(obj, ctx);
      case 'numberLine':
        return this.renderNumberLine(obj, ctx);
      case 'label':
        return this.renderLabel(obj, ctx);
      case 'fractionCircle':
      case 'paperFold':
      case 'counterGroup':
        // Not implemented in MVP
        return React.createElement('g', { key: obj.id }, 
          React.createElement('text', { x: obj.layout.x, y: obj.layout.y }, 
            `[${obj.type} - 未實現]`
          )
        );
      default:
        return null;
    }
  }

  /**
   * Check if an action is currently active
   */
  static isActionActive(action: AnimationAction, ctx: RenderContext): boolean {
    return ctx.currentTimeMs >= action.tStartMs && ctx.currentTimeMs <= action.tEndMs;
  }

  /**
   * Apply animation transforms (simplified for MVP)
   */
  static applyAnimation(
    obj: VisualObject,
    activeActions: AnimationAction[],
    ctx: RenderContext
  ): VisualObject {
    // For MVP, we'll just return the object as-is
    // Full implementation would apply transforms based on action type
    return obj;
  }

  /**
   * Render a complete scene
   */
  static renderScene(
    scene: LessonScene,
    ctx: RenderContext
  ): React.ReactElement[] {
    // Validate first
    const validation = this.validateScene(scene);
    if (!validation.valid) {
      console.error('Scene validation failed:', validation.errors);
      return [
        React.createElement('text', { key: 'error', x: 20, y: 50, fill: 'red' }, 
          '數學驗證失敗'
        )
      ];
    }

    // Find active actions
    const activeActions = scene.actions.filter(action => 
      this.isActionActive(action, ctx)
    );

    // Render all objects
    const elements = scene.objects
      .map(obj => {
        const transformed = this.applyAnimation(obj, activeActions, ctx);
        return this.renderObject(transformed, ctx);
      })
      .filter((el): el is React.ReactElement => el !== null);

    return elements;
  }
}
