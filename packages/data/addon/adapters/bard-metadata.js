/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import EmberObject from '@ember/object';
import { camelize, dasherize } from '@ember/string';
import { pluralize } from 'ember-inflector';
import { configHost } from '../utils/adapter';

export default class BardMetadataAdapter extends EmberObject {
  /**
   * @property namespace
   */
  namespace = 'v1';

  /**
   * @property {Service} ajax
   */
  @service ajax;

  /**
   * Builds a URL path for a metadata query
   *
   * @method _buildURLPath
   * @private
   * @param {String} type
   * @param {String} id
   * @param {Object} options - optional host options.
   * @return {String} URL Path
   */
  _buildURLPath(type, id, options = {}) {
    const host = configHost(options);
    const { namespace } = this;
    const urlId =
      getOwner(this)
        .lookup(`adapter:metadata/${dasherize(type)}`)
        ?.buildURLId(id) || id;

    return `${host}/${namespace}/${camelize(pluralize(type))}/${urlId}`;
  }

  /**
   * Fetches all Bard metadata
   *
   * @method fetchAll
   * @public
   * @param {String} type
   * @param {Object} options
   * @return {Promise} metadata promise object
   */
  fetchAll(type, options) {
    return this.fetchMetadata(type, '', options);
  }

  /**
   * Fetches Bard metadata
   *
   * @method fetchMetadata
   * @public
   * @param {String} type
   * @param {String} id
   * @param {Object} options
   * @return {Promise} metadata promise object
   */
  fetchMetadata(type, id, options = {}) {
    let url = this._buildURLPath(type, id, options),
      query = options.query || {},
      clientId = options.clientId || 'UI',
      timeout = options.timeout || 300000;

    return this.ajax.request(url, {
      xhrFields: {
        withCredentials: true
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('clientid', clientId);
      },
      crossDomain: true,
      data: query,
      timeout: timeout
    });
  }
}
