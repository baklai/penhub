import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { createApp } from 'vue';

import App from './App.vue';

import Tooltip from 'primevue/tooltip';

import '@/assets/base.css';
import '@/assets/fonts.css';
import 'primeicons/primeicons.css';

import Button from 'primevue/button';
import Card from 'primevue/card';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Menubar from 'primevue/menubar';
import Select from 'primevue/select';

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

app.component('Button', Button);
app.component('Card', Card);
app.component('Menubar', Menubar);
app.component('InputText', InputText);
app.component('FloatLabel', FloatLabel);
app.component('Select', Select);

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
