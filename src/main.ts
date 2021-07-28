import Vue from 'vue'
import App from './App.vue'
import { MsalPlugin, MsalPluginOptions } from './plugins/msal.plugin';

Vue.config.productionTip = false

const options: MsalPluginOptions = {
  clientId: 'c88853df-e8b2-47b8-9502-29312d950567',
  tenantId: 'f1b393e0-dd20-4ded-9ec3-2934153ebe3a',
};

Vue.use(new MsalPlugin(), options);

new Vue({
  render: h => h(App),
}).$mount('#app')
