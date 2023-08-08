<template>
  <div class="system-menu-container">
    <el-card shadow="hover">
      <el-form :model="state.searchForm" size="small" label-width="80px" class="mt35 mb35">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
            <el-form-item label="仓库号">
              <el-input size="small" v-model="state.searchForm.warehouseNo" placeholder="仓库号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
            <el-button size="small" type="primary" @click="doQuery">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="state.pageation.tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"/>
        <el-table-column prop="whNo" label="仓库号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="pos.x" label="坐标X轴" show-overflow-tooltip></el-table-column>
        <el-table-column prop="pos.y" label="坐标Y轴" show-overflow-tooltip></el-table-column>
        <el-table-column prop="faceTo.x" label="朝向X轴" show-overflow-tooltip></el-table-column>
        <el-table-column prop="faceTo.z" label="朝向Z轴" show-overflow-tooltip></el-table-column>
        <el-table-column prop="faceTo.y" label="朝向Y轴" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" :label="'修改值'">
          <template #default="scope">
            <el-button size="mini" type="text" @click.stop="handleEditBefore(scope.row)">
              {{ '修改值' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          layout="prev, pager, next"
          :total="state.pageation.total"
          :current-page="state.pageation.pageNo"
          @current-change="currentChange"
      />
    </el-card>
    <!-- 修改 -->
    <el-dialog destroy-on-close title="修改" v-model="state.editDialogDetail" center width="40%"
               :before-close="handleCloseForQuestion">
      <el-form ref="ruleForm" :model="state.formData" :rules="state.rules" label-width="130px">
        <el-form-item label="坐标X轴" prop="posX">
          <el-input clearable v-model="state.formData.posX"></el-input>
        </el-form-item>
        <el-form-item label="坐标Y轴" prop="posY">
          <el-input clearable v-model="state.formData.posY"></el-input>
        </el-form-item>

        <el-form-item label="朝向X轴" prop="faceToX">
          <el-input clearable v-model="state.formData.faceToX"></el-input>
        </el-form-item>
        <el-form-item label="朝向Y轴" prop="faceToY">
          <el-input clearable v-model="state.formData.faceToY"></el-input>
        </el-form-item>
        <el-form-item label="朝向Z轴" prop="faceToZ">
          <el-input clearable v-model="state.formData.faceToZ"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="state.editDialogDetail = false">{{ '取消' }}</el-button>
          <el-button type="primary" @click="handleEdit()">{{ '修改' }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ElMessage} from 'element-plus';
import {getCurrentInstance, onMounted, reactive} from 'vue';
import {useRouter} from 'vue-router';
import {editplatformconfApi, getplatformconfListApi} from '/@/api/stationconf';

const {proxy} = getCurrentInstance();

// 路由
const router = useRouter();

const state = reactive({
  // 查询条件
  searchForm: {
    warehouseNo: '',
    locationNo: '',
    area: '',
  },
  // 列表分页
  pageation: {
    pageSize: 10,
    pageNo: 1,
    total: 0,
    tableData: [],
  },
  // 抽屉标识
  addDrawer: false,
  // 弹框标识
  editDialogDetail: false,
  addEnterpriseDraw: false,
  // 表单
  formData: {
    posX: 0,
    posY: 0,
    faceToX: 0,
    faceToZ: 0,
    faceToY: 0,
    confId: 0,
  },
  rules: {
    // forkliftNo: [
    //   {
    //     required: true,
    //     message: '请输入叉车编号',
    //     trigger: 'blur',
    //   },
    // ],
  },
});

onMounted(() => {
  initTable();
});

function handleCloseForQuestion(done) {
  done();
  state.editDialogDetail = false;
  initTable();
}

function submitIssue() {
  state.addEnterpriseDraw = true;
}

function currentChange(t) {
  state.pageation.pageNo = t;
  initTable();
}

function doQuery() {
  state.pageation.pageNo = 1;
  initTable();
}

function initTable() {
  getplatformconfListApi({
    warehouseNo: state.searchForm.warehouseNo,
    pageSize: state.pageation.pageSize,
    pageNo: state.pageation.pageNo,
  })
      .then((res) => {
        state.pageation.tableData = res.items;
        state.pageation.total = res.more;
        ElMessage.success('加载列表成功');
      })
      .catch((err) => {
        console.log(err);
      });
}

function handleEditBefore(row) {
  state.editDialogDetail = true;
  state.formData.confId = row.id

  state.formData.posX = row.pos.x
  state.formData.posY = row.pos.y

  state.formData.faceToZ = row.faceTo.z
  state.formData.faceToX = row.faceTo.x
  state.formData.faceToY = row.faceTo.y
}

function handleClose(done) {
  done();
  initTable();
}

// 修改
function handleEdit() {
  proxy.$refs['ruleForm'].validate().then((value) => {
    if (value) {
      console.log(state.formData)
      editplatformconfApi({
        id: state.formData.confId,
        posX: parseInt(state.formData.posX),
        posY: parseInt(state.formData.posY),
        faceZ: parseFloat(state.formData.faceToZ),
        faceY: parseFloat(state.formData.faceToY),
        faceX: parseFloat(state.formData.faceToX),
      }).then((res) => {
        initTable();
        state.editDialogDetail = false;
      });
    }
  });
}
</script>
