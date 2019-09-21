import React, {Component} from 'react'
import { Upload, Icon, Modal, Button, message } from 'antd'
import { UPLOAD_URL } from '../../../public/config'

// 设置数据格式
const setFileList = (dataSource : any, maxImgLen : any) => {
  const maxLen = maxImgLen === undefined
    ? 1
    : maxImgLen;
  const fileList: any[] = [];
  let fileListArr = [dataSource];
  if (dataSource === '' || dataSource === null || dataSource === undefined) {
    fileListArr = [];
  }
  if (maxLen === 1) {
    if (fileListArr.length > 0) {
      fileListArr = [dataSource];
    }
  } else if (maxLen > 1) {
    if (Array.isArray(dataSource)) {
      fileListArr = dataSource;
    }
  }

  // 给传进来的数据加上一个key
  fileListArr.forEach((item: any, index: any) => {
    const obj = {
      ...item,
      uid: item.id || index,
      name: item.oldFileName || '',
    }
    fileList.push(obj);
  });
  return fileList;
};

interface IProps {
  form: any;
  name: string
  onChange: any
  maxImgLen?: number
  disabled?: boolean, 
  dataSource?: any
  acceptType?: any
  listType?: any
  onChangeFile?: (list: any) => void
}

interface IState {
  maxImgLen: number, // 上传图片最大数量
  form:any,
  name: string,
  fileList: any,
  loading: boolean,
  previewVisible: boolean,
  previewImage: string,
  previewType: number,
  isFirst: boolean,

}

class UploadImg extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    const { dataSource, maxImgLen, form, name } = props;
    const maxLen = maxImgLen === undefined
      ? 1
      : maxImgLen;
    const fileList = setFileList(dataSource, maxImgLen);
    this.state = {
      maxImgLen: maxLen, // 上传图片最大数量
      form,
      name,
      fileList,
      loading: false,
      previewVisible: false,
      previewImage: '',
      previewType: 1,
      isFirst: true,
    };
  }

  // 同步更新父组件图片值
  componentWillReceiveProps(nextProps: any) {
    const { dataSource, maxImgLen } = nextProps;
    const { isFirst } = this.state;
    const { fileList: flist } = this.state;
    let fileList = [];
    if (flist && flist.length < 1) {
      fileList = setFileList(dataSource, maxImgLen);
    } else {
      fileList = flist;
    }
    if (isFirst && fileList.length > 0) {
      this.setFormValue(fileList);
      this.setState({ fileList, isFirst: false });
    }
  }

  // 设置表单 (maxImgLen=1 的时候传回一个字符串, maxImgLen > 1 的时候传回一个数组)
  setFormValue = (newImageList: any[]) => {
    const { maxImgLen, name, form } = this.state;
    let formList = [];
    if (maxImgLen > 1) {
      newImageList.forEach(item => {
        formList.push(item.url);
      });
    } else {
      formList = newImageList.length > 0
        ? newImageList[0].url
        : '';
    }
    form.setFieldsValue({[name]: formList });
  };

  // 取消预览
  handleCancel = () => this.setState({ previewVisible: false })

  // 预览
  handlePreview = (file: any) => {
    let previewImage = file.response && file.response.data || file.url || file.thumbUrl
    this.setState({ previewImage, previewVisible: true});
  }

  // 删除图片
  handleDeleteImg = (file: any) => {
    const { onChangeFile } = this.props;
    const { fileList } = this.state;
    const index = fileList.indexOf(file);
    const newImageList = fileList.slice();
    newImageList.splice(index, 1);
    this.setState({ fileList: newImageList });
    this.setFormValue(newImageList);
    if (onChangeFile)
      {onChangeFile(newImageList);}
    };

  // 上传图片事件
  handleChange = (e: any) => {
    let { acceptType } = this.props
    if (!acceptType) {
      acceptType = '.jpg, .gif, .jpeg, .png, .mp4'
    }
    const { fileList, file } = e
    // IE判断上传格式
    const temp = file
      .name
      .split('.')
    const fileType = temp[temp.length - 1]
    if (!acceptType.includes(fileType)) {
      message.error(`请选择正确的文件格式${acceptType}`)
      return
    }
    const { name, onChange } = this.props
    this.setState({ fileList })
    onChange(name, fileList)
  }

  render() {
    const { previewVisible, previewImage, fileList, maxImgLen } = this.state;
    const { acceptType, disabled, listType } = this.props
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const uploadFileButton = (
      <Button>
        <Icon type="upload"/>
        点击上传
      </Button>
    )
    const props = {
      action: UPLOAD_URL,
      onPreview: this.handlePreview,
      onChange: this.handleChange,
      fileList,
      multiple: true,
      accept: acceptType || '.jpg, .gif, .jpeg, .png, .mp4',
      listType: listType || 'picture-card',
    }
    return (
      <div className="clearfix">{} < Upload
      {
        ...props}
        disabled={disabled}
        > {listType === 'text'
          ? uploadFileButton
          : fileList.length >= maxImgLen
            ? null
            : uploadButton}
      </Upload>
      <Modal
        centered
        footer={null}
        onCancel={this.handleCancel}
        visible={previewVisible}
        width={800}>
        <div style={{
          textAlign: 'center',
        }}>
          <img
                alt="example"
                src={previewImage}
                style={{
                width: '100%',
              }}/>

        </div>
      </Modal>
    </div>
    );
  }
}
export default UploadImg
