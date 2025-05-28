import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { createApp } from 'vue';

import App from './App.vue';

import Tooltip from 'primevue/tooltip';

import '@/assets/base.css';
import '@/assets/fonts.css';
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(createPinia());

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false
    }
  },
  inputVariant: 'outlined',
  ripple: false
});

app.directive('tooltip', Tooltip);

app.config.errorHandler = function (err, vm, info) {
  console.error('errorHandler', {
    error: err,
    vm,
    info
  });
};

app.config.warnHandler = (msg, instance, trace) => {
  console.error('warnHandler', {
    message: msg,
    instance,
    trace
  });
};

app.mount('#app');
