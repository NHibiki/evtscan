import { ApiCaller } from './main';
import Fetch from 'node-fetch';

ApiCaller.Config.fetch = Fetch;

export * from './main';
