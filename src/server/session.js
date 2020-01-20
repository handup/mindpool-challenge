
import session from 'express-session';
import memorystore from 'memorystore';
import config from '../configs/index';

const MemoryStore = memorystore(session);

const checkPeriod = 60 * 60 * 1000;

export default () => session({
    store: new MemoryStore({ checkPeriod }),
    resave: false,
    saveUninitialized: true,
    secret: config.server.secret,
    cookie: { secure: config.env !== 'develop' }
});
