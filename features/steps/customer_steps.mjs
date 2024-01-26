import pactum from 'pactum';
import { Before, Given, When, Then } from '@cucumber/cucumber';

let spec = pactum.spec();

Before(() => {
  pactum.request.setBaseUrl('http://localhost:3001');
  pactum.settings.setReporterAutoRun(false);
  spec = pactum.spec();
});

Given(/^I make a (.*) request to (.*)$/, function (method, endpoint) {
  spec[method.toLowerCase()](endpoint);
});

When('I receive a response', async function () {
  await spec.toss();
});

Then('I expect response should have a status {int}', function (code) {
  spec.response().should.have.status(code);
});

Then(/^I expect response should have a json schema$/, function (json) {
  spec.response().should.have.jsonSchema(JSON.parse(json));
});