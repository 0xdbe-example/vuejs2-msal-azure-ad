<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <button v-if="!isAuthenticated" @click="signIn()">Sign In</button>
      <button v-if="isAuthenticated" @click="signOut()">Sign Out</button>
    </div>
    <router-view/>
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
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
