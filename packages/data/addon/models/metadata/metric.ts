/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */
import { inject as service } from '@ember/service';
import ColumnMetadataModel, { BaseExtendedAttributes, ColumnMetadata, ColumnMetadataPayload } from './column';
import MetricFunction from './metric-function';

// Shape of public properties on model
export interface MetricMetadata extends ColumnMetadata {
  defaultFormat: string;
  metricFunction: MetricFunction | undefined;
  hasParameters: boolean;
  arguments: TODO[];
  getParameter(id: string): TODO | undefined;
  getDefaultParameters(): Dict<string> | undefined;
  extended: Promise<MetricMetadataModel & ExtendedAttributes>;
}
// Shape passed to model constructor
export interface MetricMetadataPayload extends ColumnMetadataPayload {
  defaultFormat: string;
  metricFunctionId?: string;
}

type ExtendedAttributes = BaseExtendedAttributes;
export default class MetricMetadataModel extends ColumnMetadataModel implements MetricMetadata, MetricMetadataPayload {
  /**
   * @static
   * @property {string} identifierField
   */
  static identifierField = 'id';

  /**
   * @property {Ember.Service} keg
   */
  @service('bard-metadata')
  metadataService!: TODO;

  /**
   * @property {string} defaultFormat - e.g. decimal for numbers
   */
  defaultFormat!: string;

  /**
   * @property {string} metricFunctionId
   */
  metricFunctionId!: string;

  /**
   * Many to One relationship
   * @property {MetricFunction} metricFunction
   */
  get metricFunction(): MetricFunction | undefined {
    const { metricFunctionId, source, metadataService } = this;

    if (metricFunctionId) {
      return metadataService.getById('metric-function', metricFunctionId, source);
    }
    return undefined;
  }

  /**
   * @property {boolean} hasParameters
   */
  get hasParameters(): boolean {
    return !!this.arguments?.length;
  }

  /**
   * @property {object[]} arguments - arguments for the metric
   */
  get arguments(): TODO[] {
    return this.metricFunction?.arguments || [];
  }

  /**
   * @method getParameter - retrieves the queried parameter object from metadata
   * @param {string} id
   * @returns {object|undefined}
   */
  getParameter(id: string): TODO | undefined {
    if (!this.hasParameters) {
      return;
    }

    return this.arguments.find(arg => arg.id === id);
  }

  /**
   * @method getDefaultParameters - retrieves all the default values for all the parameters
   * @returns {Dict<string>|undefined}
   */
  getDefaultParameters(): Dict<string> | undefined {
    if (!this.hasParameters) {
      return;
    }

    return this.arguments.reduce((acc: Dict<string>, curr) => {
      acc[curr.id] = curr.defaultValue;
      return acc;
    }, {});
  }

  /**
   * @property {Promise} extended - extended metadata for the metric that isn't provided in initial table fullView metadata load
   */
  get extended(): Promise<MetricMetadataModel & ExtendedAttributes> {
    const { metadataService, id, source } = this;
    return metadataService.findById('metric', id, source);
  }
}
