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
            <el-form-item label="区域">
              <el-input size="small" v-model="state.searchForm.area" placeholder="区域" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
            <el-form-item label="库位号">
              <el-input size="small" v-model="state.searchForm.locationNo" placeholder="库位号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
            <el-button size="small" type="primary" @click="doQuery">查询</el-button>
            <el-button type="success" @click="calculatePosition()">自动计算坐标值</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="state.pageation.tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"/>
        <el-table-column prop="locationNo" label="库位号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="warehouseNo" label="仓库号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="area" label="area" show-overflow-tooltip></el-table-column>
        <el-table-column prop="posX" label="X" show-overflow-tooltip></el-table-column>
        <el-table-column prop="posY" label="Y" show-overflow-tooltip></el-table-column>
        <el-table-column prop="posZ" label="Z" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" :label="'修改坐标'">
          <template #default="scope">
            <el-button size="mini" type="text" @click.stop="handleEditBefore(scope.row)">
              {{ '修改坐标值' }}
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
        <el-form-item label="X" prop="title">
          <el-input clearable v-model="state.formData.relX"></el-input>
        </el-form-item>
        <el-form-item label="Y" prop="description">
          <el-input clearable v-model="state.formData.relY"></el-input>
        </el-form-item>
        <el-form-item label="Z" prop="description">
          <el-input clearable v-model="state.formData.relZ"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="state.editDialogDetail = false">{{ '取消' }}</el-button>
          <el-button type="primary" @click="handleEdit()">{{ '修改' }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加企业 -->
    <el-drawer
        :title="'添加企业'"
        v-model="state.addEnterpriseDraw"
        destroy-on-close
        custom-class="drawer"
        ref="drawer"
        :close-on-press-escape="true"
        :before-close="handleClose"
        direction="rtl"
        size="80%"
    >
      <addEnterprise/>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import {ElMessage} from 'element-plus';
import {getCurrentInstance, onMounted, reactive} from 'vue';
import {useRouter} from 'vue-router';
import {
  calculateposlocationApi,
  editlocationconfApi,
  getlocationconfByIdApi,
  getlocationconfListApi
} from '/@/api/locationconf';
import addEnterprise from './component/add.vue';

const {proxy} = getCurrentInstance();

// 路由
//定义router变量
const router = useRouter();

const state = reactive({
  // 查询条件
  searchForm: {
    warehouseNo: 'A511PX',
    locationNo: '',
    area: 'PX01',
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
    relX: 0,
    relY: 0,
    relZ: 0,
    confId: 0,
    locationId: 0,
    warehouseId: 0
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

async function calculatePosition() {
  const {code: code} = await calculateposlocationApi()
  console.log(code)
  if (code == 200) {
    initTable()
  }
}

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
  getlocationconfListApi({
    warehouseNo: state.searchForm.warehouseNo,
    locationNo: state.searchForm.locationNo,
    area: state.searchForm.area,
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
  // dellocationconfByIdApi({id: row.id}).then((res) => {
  //   state.editDialogDetail = true;
  //   state.formData.confId = res.data.confId
  //   state.formData.warehouseId = res.data.warehouseId
  //   state.formData.locationId = res.data.locationId
  //   state.formData.relX = res.data.posX
  //   state.formData.relY = res.data.posY
  //   state.formData.relZ = res.data.posZ
  // });

  state.editDialogDetail = true;
  state.formData.confId = row.confId
  state.formData.warehouseId = row.warehouseId
  state.formData.locationId = row.locationId
  state.formData.relX = row.posX
  state.formData.relY = row.posY
  state.formData.relZ = row.posZ
}

function handleClose(done) {
  done();
  initTable();
}

// 修改
function handleEdit() {
  proxy.$refs['ruleForm'].validate().then((value) => {
    if (value) {
      editlocationconfApi({
        confId: state.formData.confId,
        warehouseId: state.formData.warehouseId,
        locationId: state.formData.locationId,
        relX: parseInt(state.formData.relX),
        relY: parseInt(state.formData.relY),
        relZ: parseInt(state.formData.relZ),
      }).then((res) => {
        initTable();
        state.editDialogDetail = false;
      });
    }
  });
}

// 删除
function handleDel(row) {
  getlocationconfByIdApi({id: row.id}).then((res) => {
    ElMessage.success('删除成功');
    initTable();
  });
}
</script>
