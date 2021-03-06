import DS from 'ember-data';
import { fragment, fragmentArray } from 'ember-data-model-fragments/attributes';

export default DS.Model.extend({
  table: fragment('bard-request/fragments/logicalTable'),
  dimensions: fragmentArray('bard-request/fragments/dimension'),
  filters: fragmentArray('bard-request/fragments/filter'),
  having: fragmentArray('bard-request/fragments/having'),
  intervals: fragmentArray('bard-request/fragments/interval'),
  metrics: fragmentArray('bard-request/fragments/metric'),
  sorts: fragmentArray('bard-request/fragments/sort'),
  request: fragment('bard-request/request')
});
