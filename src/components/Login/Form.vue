//Form.vue

<template>
  <div>

    <form v-if="!isSubmitted" @submit.prevent="submit" novalidate>
 
      <div class="form-group">
        <label for="email">{{ $t('form.email') }} *</label>
        <input type="email" class="form-control" id="email" v-model.lazy.trim="form.email" @blur="onFieldBlur('email')" v-bind:class="getFieldClasses('email')">
        <div v-if="isErrorField('email')" class="invalid-feedback">{{ $t('error.fieldInvalid', { field: $t('form.email') }) }}</div>
      </div>

      <div class="alert alert-danger" v-if="isError">
        <p class="mb-0">
          <strong>{{ $t(errorHeader) }}</strong>
        </p>
        <ul class="mb-0 pl-3" v-if="errors.length > 0">
          <li v-for="error in errors" v-bind:key="error.field">
            <span v-if="error.field">{{ $t('form.'+error.field) }}<span v-if="error.message">: {{ $t(error.message) }}</span></span>
            <span v-else-if="error.message">{{ $t(error.message) }}</span>
          </li>
        </ul>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-success" :disabled="submitting">
          <span v-if="submitting">{{ $t('form.submitting') }} <img src="../../assets/loader.svg" /></span>
          <span v-else>{{ $t('form.submit') }}</span>
        </button>
      </div>

    </form>

    <div v-else>
      <div class="alert alert-success">
        <strong><center>{{ $t('form.submitted') }}</center></strong>
      </div>
      <div class="alert alert-info">
        <p><strong>{{ $t('form.sentInfo') }}</strong></p>
        <pre>
            {{form.email}}
        </pre>
      </div>

      <div class="row">
        <div class="col-sm-12 text-center">
          <button id="btnSearch" class="btn btn-primary btn-md center-block" Style="width: 100px;" @click.prevent="reload()">{{ $t('form.return' ) }}</button>
          <button id="btnClear" class="btn btn-success btn-md center-block" Style="width: 100px;" OnClick="btnClear_Click" >Access</button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script src="./Form.js"></script>
<style src="./Form.sass" lang="sass" scoped></style>
