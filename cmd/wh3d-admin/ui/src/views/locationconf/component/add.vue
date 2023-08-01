<template>
  <div class="system-menu-container">
  </div>
</template>


<script setup lang="ts">
import {getCurrentInstance, onMounted, reactive} from 'vue';
import {ElMessage} from 'element-plus';
import {addlocationconfApi} from '/@/api/locationconf';
import {Session} from '/@/utils/storage';

const {proxy} = getCurrentInstance();

const state = reactive({
  dialogconsolidateBalance: false,
  dialogconsolidatedIncomeStatement: false,
  dialogconsolidatedCashFlow: false,
  value: '',
  data: [],
  userListDialogDetailForPromoter: false,
  fileList: [],
  userInfo: Session.get('userInfo'),
  formData: {},
  rules: {
    forkliftNo: [
      {
        required: true,
        message: '请输入叉车编号',
        trigger: 'blur',
      },
    ],
  },
});

onMounted(() => {
});

function changePromoter() {
  state.userListDialogDetailForPromoter = true;
}

function getChildCurrentRowByUserListForPromoter(row) {
  // console.log(row);
  state.formData.projectId = row.id;
  state.formData.projectName = row.name;
  state.userListDialogDetailForPromoter = false;
}

// 文件上传成功回调
function onSuccess(response, file, fileList) {
  // console.log(response);
  state.formData.businessLicenseFile = response.data;
}

function addSku() {
  proxy.$refs['ruleForm'].validate().then((value) => {
    if (value) {
      // state.formData.creatorId = state.userInfo.userId;
      console.log(state.formData);
      addlocationconfApi(state.formData)
          .then((res) => {
            // console.log(res);
            ElMessage.success('创建成功');
          })
          .catch((err) => {
            ElMessage.error('操作失败');
          });
    }
  });
}

function handleClose(done) {
  ElMessageBox.confirm('确定关闭吗？')
      .then(() => {
        done();
      })
      .catch(() => {
        // catch error
      });
}
</script>
