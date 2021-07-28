<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <button v-if="!isAuthenticated" @click="signIn()">Sign In</button>
    <button v-if="isAuthenticated" @click="signOut()">Sign Out</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {

  @Prop() private msg!: string;
  public get isAuthenticated(): boolean {
    return this.$msal.isAuthenticated;
  }
  public async signIn() {
    await this.$msal.signIn();
  }
   public async signOut() {
    await this.$msal.signOut();
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
