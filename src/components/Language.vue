<template>
  <div>
    <div class="box">
      <div class="tit">{{ title }}</div>
      <ul>
        <li><router-link to="/doc/flyio-en/readme">English</router-link></li>
        <li><router-link to="/doc/flyio/readme">中文简体</router-link></li>
      </ul>
      <div class="copyright">Copyright © liusheng22  2025 </div>
    </div>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        title: '选择语言 / Choose Language'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  *{
    box-sizing: border-box;
  }

  .box {
    width: 550px;
    margin: 50px auto;
    padding: 0 16px;
    min-height: 300px;
    position: relative;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .tit {
    font-size: 24px;
    font-weight: bold;
    padding: 30px 0;
    border-bottom: #eee 1px solid;
    text-align: center;
    color: #333;
  }
  ul{
    margin-top: 40px;
    padding: 0;
    text-align: center;
  }
  ul li{
    display: inline-block;
    margin: 0 20px;
  }
  ul li a {
    display: inline-block;
    padding: 15px 30px;
    background: #009688;
    color: white;
    text-decoration: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s ease;
    min-width: 120px;
  }
  ul li a:hover {
    background: #00796b;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,150,136,0.3);
  }
  @media screen and (max-width: 550px) {
    .box{
      width: 100%;
      padding: 0 20px;
      margin: 20px auto;
    }
    ul li{
      display: block;
      margin: 15px 0;
    }
    ul li a {
      width: 100%;
      text-align: center;
    }
  }
  .copyright{
    color: #bbb;
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 14px;
  }
</style>
