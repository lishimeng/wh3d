<template>
	<div class="system-menu-container">
		<el-card shadow="never">
			<el-form ref="ruleForm" :model="state.formData" :rules="state.rules" label-width="180px">
				<el-row>
					<el-col :span="24">
						<h2>企业基础信息</h2>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="企业名称" prop="enterpriseName">
							<el-input clearable v-model="state.formData.enterpriseName" placeholder="企业名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="工商登记/税务号" prop="taxNumber">
							<el-input clearable v-model="state.formData.taxNumber" placeholder="描述"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="上传营业执照">
							<el-upload
								:auto-upload="true"
								:headers="{
									'Access-Control-Allow-Origin': true,
								}"
								:multiple="false"
								v-model:file-list="state.fileList"
								class="upload-demo"
								:limit="1"
								name="uploadFile"
								:on-success="onSuccess"
								:action="state.fileUploadUrl"
							>
								<el-button size="mini" type="plain">上传</el-button>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
				<br />
				<el-row>
					<el-col :span="8">
						<el-form-item label="成立时间" prop="establishedTime">
							<el-date-picker value-format="YYYY-MM-DD" v-model="state.formData.establishedTime" type="date" placeholder="成立时间" /> </el-form-item
					></el-col>
					<el-col :span="8">
						<el-form-item label="注册地址">
							<el-input
								v-model="state.formData.registeredAddress"
								:min="0"
								:max="999"
								controls-position="right"
								placeholder="注册地址"
								class="w100"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="办公地点">
							<el-input
								type="textarea"
								v-model="state.formData.officeLocation"
								:min="0"
								:max="999"
								controls-position="right"
								placeholder="办公地点多个逗号分割如: A地点,B地点"
								class="w100"
							/>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="24">
						<h2>企业法人代表</h2>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="8">
						<el-form-item label="企业法人代表名字 " prop="enterpriseName">
							<el-input clearable v-model="state.formData.legalPersonName" placeholder="企业法人代表名字"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="企业法人代表身份证 " prop="legalPersonIdCard">
							<el-input clearable v-model="state.formData.legalPersonIdCard" placeholder="企业法人代表身份证"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="企业法人代表名字 " prop="enterpriseName">
							<el-input clearable v-model="state.formData.legalPersonName" placeholder="企业法人代表名字"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<br />
				<el-row>
					<el-col :span="8">
						<el-form-item label="企业法人代表电话 " prop="legalPersonTelephone">
							<el-input clearable v-model="state.formData.legalPersonTelephone" placeholder="企业法人代表电话"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="企业法人代表邮箱 " prop="legalPersonEmail">
							<el-input clearable v-model="state.formData.legalPersonEmail" placeholder="企业法人代表邮箱"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<br />

				<el-row>
					<el-col :span="24">
						<h2>企业总经理</h2>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="企业总经理名字 " prop="generalManagerName">
							<el-input clearable v-model="state.formData.generalManagerName" placeholder="企业总经理名字"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="企业总经理身份证 " prop="generalManagerIdCard">
							<el-input clearable v-model="state.formData.generalManagerIdCard" placeholder="企业总经理身份证"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="企业总经理护照号码 " prop="generalManagerPassportNo">
							<el-input clearable v-model="state.formData.generalManagerPassportNo" placeholder="企业总经理护照号码"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<br />
				<el-row>
					<el-col :span="8">
						<el-form-item label="企业总经理电话 " prop="generalManagerTelephone">
							<el-input clearable v-model="state.formData.generalManagerTelephone" placeholder="企业总经理电话"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="企业总经理邮箱 " prop="generalManagerEmail">
							<el-input clearable v-model="state.formData.generalManagerEmail" placeholder="企业总经理邮箱"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<br />

				<el-row>
					<el-col :span="24">
						<h2>企业财务负责人</h2>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="企业财务负责人名字 " prop="generalManagerName">
							<el-input clearable v-model="state.formData.financeOfficerName" placeholder="企业财务负责人名字"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="企业财务负责人电话 " prop="generalManagerIdCard">
							<el-input clearable v-model="state.formData.financeOfficerTelephone" placeholder="企业财务负责人电话"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="企业财务负责人邮箱 " prop="financeOfficerEmail">
							<el-input clearable v-model="state.formData.financeOfficerEmail" placeholder="企业财务负责人邮箱"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<br />
				<el-row>
					<el-col :span="24">
						<h2>企业董事会秘书或行政负责人</h2>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="秘书或行政负责人名字 " prop="generalManagerName">
							<el-input clearable v-model="state.formData.boardSecretaryName" placeholder="秘书或行政负责人名字"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="秘书或行政负责人电话 " prop="generalManagerIdCard">
							<el-input clearable v-model="state.formData.boardSecretaryTelephone" placeholder="秘书或行政负责人电话"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="秘书或行政负责人邮箱 " prop="financeOfficerEmail">
							<el-input clearable v-model="state.formData.boardSecretaryEmail" placeholder="秘书或行政负责人邮箱"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<br />
				<el-form-item>
					<el-button type="primary" @click="state.dialogconsolidateBalance = true">提交资产负债表</el-button>
					<el-button type="primary" @click="addSku()">提交</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 合并资产负债表 -->
		<el-dialog v-model="state.dialogconsolidateBalance" destroy-on-close title="合并资产负债表" width="80%" hight="100%" :before-close="handleClose">
			<div><consolidateBalance :enterpriseId="route.query.id" /></div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="state.dialogconsolidateBalance = false">取消</el-button>
					<el-button type="primary" @click="state.dialogconsolidateBalance = false">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>


<script setup lang="ts">
import { reactive, onMounted, getCurrentInstance } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';
import { addinvestedEnterpriseApi, upaloadAttachmentUrl, getinvestedEnterpriseByIdApi } from '/@/api/investedEnterprise';
import { Session } from '/@/utils/storage';
import consolidateBalance from './consolidateBalance.vue';
import consolidatedIncomeStatement from './consolidatedIncomeStatement.vue';
import consolidatedCashFlow from './consolidatedCashFlow.vue';

const { proxy } = getCurrentInstance();
const route = useRoute();
const state = reactive({
	dialogconsolidateBalance: false,
	dialogconsolidatedIncomeStatement: false,
	dialogconsolidatedCashFlow: false,
	value: '',
	data: [],
	fileUploadUrl: upaloadAttachmentUrl,
	userListDialogDetailForPromoter: false,
	fileList: [],
	userInfo: Session.get('userInfo'),
	formData: {
		enterpriseId: route.query.id,
	},
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
	getEnterpriseInfo();
});
// 获取工单信息
function getEnterpriseInfo() {
	getinvestedEnterpriseByIdApi({
		id: state.formData.enterpriseId,
	}).then((res) => {
		state.formData = res.data;
	});
}

// 文件上传成功回调
function onSuccess(response, file, fileList) {
	state.formData.businessLicenseFile = response.data;
}
function addSku() {
	proxy.$refs['ruleForm'].validate().then((value) => {
		if (value) {
			// state.formData.creatorId = state.userInfo.userId;
			console.log(state.formData);
			addinvestedEnterpriseApi(state.formData)
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