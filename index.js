/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { withAppearance } from './src/hooks/useAppearance';

AppRegistry.registerComponent(appName, () => withAppearance(App));
