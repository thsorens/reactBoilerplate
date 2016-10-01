'use strict';
import Config from '../config';
import AbstractService from './abstractService';

const urls = {
  getTest: "Test/{testparam}"
};

class TestService extends AbstractService {
  constructor() {
    super(Config.runtime.urls.apiBaseUrl, "application/json");
  }

  getTest(param) {
    return this.json(urls.getTest.replace("{testparam}", param));
  }

}

module.exports = TestService;
