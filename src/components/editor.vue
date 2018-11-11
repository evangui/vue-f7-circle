<template>
  <div class="editor-container">
  		<div class="list" style="padding: 5px 16px;">
				<div class="item-input-wrap" >
          <textarea :placeholder="placeholder" style="height: 190px;" v-model="editText">{{text}}</textarea>
        </div>
		            
      <ul class="tools flex-row">
          <span class="tool" v-show="enableTool('camera')"><i class="iconfont icon-ios7cameraoutline"></i></span>
          <span class="tool" v-show="enableTool('album')"><i class="iconfont icon-pic"></i></span>
          <span class="tool" v-show="enableTool('emotion')"><i class="iconfont icon-emotion"></i></span>
          <span class="tool" v-show="enableTool('at')"><i class="iconfont icon-iosatoutline"></i></span>          
          <span class="tool" v-show="enableTool('location')"><i class="iconfont icon-location"></i></span>
      </ul>
     </div>
  </div>
</template>

<style>
</style>

<script>
export default {
  props: {
    enableTools: {
      type: String,
      default: 'camera,album,emotion,at,location'
    },
    text: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editText: ''
    }
  },
  watch: {
    editText(text) {
      this.$emit('text:change', text)
    }
  },
  methods: {
    enableTool(name) {
      let tools = this.enableTools.split(',')
      return ~tools.indexOf(name)
    }
  }
}
</script>