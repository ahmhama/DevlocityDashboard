/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, notification, Row, Select, Upload } from 'antd';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import PhoneInput, { getCountryCallingCode } from 'react-phone-number-input'
import { Option } from 'antd/lib/mentions';
import FormData from 'form-data';
import { useDispatch, useSelector } from 'react-redux';
import { FormValidationWrap, VerticalFormStyleWrap } from '../forms/overview/Style';
import { Cards } from '../../components/cards/frame/cards-frame';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Checkbox } from '../../components/checkbox/checkbox';
import 'react-phone-number-input/style.css'
import { Main } from '../styled';
import { editSubAdmin, getSubAdminById, removeSubAdminError } from '../../redux/subAdmin/actionCreator';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js/max'



const EditSubAdmin = () => {
    const { SubAdminId } = useParams();
    const dispatch = useDispatch();
    const { dataAdmin, errorMessageEdit } = useSelector(state => state.SubAdmin);
    const [form] = Form.useForm();
    const data = new FormData();


    const [permission, setPermission] = useState()

    const [NOPhone, setNOPhone] = useState()

    useEffect(() => {
        dispatch(getSubAdminById(SubAdminId));
    }, [dispatch, SubAdminId]);

    const openNotificationWithIcon = type => {
        notification[type]({
            message: 'Notification',
            description: errorMessageEdit.responseMessage
        });
    };

    if (dataAdmin && permission == null) {
        setPermission(dataAdmin?.permissions)
    }

    console.log(permission)
    if (dataAdmin && NOPhone == null) {
        const phone = `+${getCountryCallingCode(dataAdmin?.countryCode)}${dataAdmin.mobileNumber}`
        setNOPhone(phone)
    }
    const getValues = values => {
        const phoneNumber = parsePhoneNumber(NOPhone)
        data.append("subAdminId", SubAdminId)
        data.append("firstName", values.fName)
        data.append('lastName', values.lName);
        if (isValidPhoneNumber(phoneNumber.number, phoneNumber.country) && phoneNumber.isValid()) {
            data.append('countryCode', phoneNumber.country);
            data.append('mobileNumber', phoneNumber.nationalNumber);
        }
        data.append('gender', values.gender);
        if (values.profilePic.file !== undefined) {
            data.append('profilePic', values.profilePic.file);
        }
        data.append('role', "Admin Admin");
        data.append('permissions', JSON.stringify(permission));
        dispatch(editSubAdmin(data))

        data.delete('subAdminId');
        data.delete('firstName');
        data.delete('lastName');
        data.delete('countryCode');
        data.delete('mobileNumber');
        data.delete('gender');
        data.delete('profilePic');
        data.delete('role');
        data.delete('permissions');
    }

    const onChange = (option, operation) => {
        setPermission({ ...permission, [option]: { ...permission[option], [operation]: !permission[option][operation] } })
    };

    useEffect(() => {
        if (errorMessageEdit) {
            if (errorMessageEdit?.responseCode === 200) {
                openNotificationWithIcon('success');
                dispatch(getSubAdminById(SubAdminId));
                dispatch(removeSubAdminError())

            }
            else {
                openNotificationWithIcon('error');
                dispatch(removeSubAdminError())
            }
        }
    }, [errorMessageEdit]);

    return (
        <>
            <PageHeader
                ghost
                title="Edit Sub Admin"
                buttons={[
                    <Button className="btn-add_new" size="default" type="primary" key="1" >
                        <Link to="/admin/listAdvertisement">Edit Sub Admin</Link>
                    </Button>
                ]} />

            <Main>
                <Row gutter={25}>
                    <Col xs={24}>
                        <FormValidationWrap>
                            <VerticalFormStyleWrap>
                                <Cards >
                                    {dataAdmin && <Form name="sDash_validation-form" form={form} layout="vertical" onFinish={getValues}>
                                        <Row gutter={30}>
                                            <Col md={8} xs={24}>
                                                <Form.Item
                                                    name="fName"
                                                    label="First Name"
                                                    initialValue={dataAdmin.firstName}
                                                    rules={[
                                                        { required: true, message: 'First Name required!' },
                                                        { min: 10, message: 'must be at least 10 characters!' }
                                                    ]}
                                                >
                                                    <Input placeholder="Enter First Name" />
                                                </Form.Item>
                                            </Col>

                                            <Col md={8} xs={24}>
                                                <Form.Item
                                                    name="lName"
                                                    label="Last Name"
                                                    initialValue={dataAdmin.lastName}
                                                    rules={[
                                                        { required: true, message: 'Last Name required!' },
                                                        { min: 10, message: 'must be at least 10 characters!' }
                                                    ]}
                                                >
                                                    <Input placeholder="Enter Last Name" />
                                                </Form.Item>
                                            </Col>

                                            {/* <Col md={8} xs={24}>
                                                <Form.Item
                                                    name="email"
                                                    label="E-mail"
                                                    initialValue={dataAdmin.email}
                                                    rules={[
                                                        { required: true, message: 'E-mail required!' },
                                                        { type: 'email', message: 'The input is not valid E-mail!', }
                                                    ]}
                                                >
                                                    <Input placeholder="Enter title" />
                                                </Form.Item>
                                            </Col> */}


                                            <Col md={8} xs={24}>
                                                <Form.Item name="PhoneNO"
                                                    label="phone number">
                                                    <div className='hhh'>
                                                        <PhoneInput
                                                            placeholder="Enter phone number"
                                                            value={NOPhone}
                                                            defaultCountry={dataAdmin?.countryCode}
                                                            onChange={setNOPhone} />
                                                    </div>
                                                </Form.Item>
                                            </Col>

                                            <Col md={8} xs={24}>
                                                <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Gender required!' }]} initialValue={dataAdmin.gender}>
                                                    <Select size="large" className="sDash_fullwidth-select" placeholder="Select Gender" >
                                                        <Option value="Male" >Male</Option>
                                                        <Option value="Female">Female</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>


                                            <Col md={8} xs={24}>
                                                <Form.Item
                                                    name="profilePic"
                                                    label="picture"
                                                    initialValue={dataAdmin.profilePic.url}
                                                    rules={[{ required: true, message: 'profile picture required!' }]}
                                                >
                                                    <Upload
                                                        name="profilePic"
                                                        beforeUpload={() => false}
                                                        className="sDash_upload-basic"
                                                        accept="image/*"
                                                        maxCount={1}
                                                    >
                                                        <span className="sDash_upload-text">Select picture</span>
                                                        <Link to="#" className="sDash_upload-browse">
                                                            Browse
                                                        </Link>
                                                    </Upload>
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row gutter={30}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                Snippet
                                            </Col>
                                            <Col md={4} xs={24} style={{
                                                textAlign: 'center',
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                Write
                                            </Col>
                                            <Col md={4} xs={24} style={{
                                                textAlign: 'center',
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                Read
                                            </Col>
                                            <Col md={4} xs={24} style={{
                                                textAlign: 'center',
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                Update
                                            </Col>
                                            <Col md={4} xs={24} style={{
                                                textAlign: 'center',
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                Delete
                                            </Col>
                                        </Row>


                                        <Row gutter={30} style={{ marginTop: "15px" }}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                KYC Management
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.kycManagement.isWrite} onChange={() => onChange("kycManagement", "isWrite")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.kycManagement.isRead} onChange={() => onChange("kycManagement", "isRead")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.kycManagement.isUpdate} onChange={() => onChange("kycManagement", "isUpdate")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.kycManagement.isDelete} onChange={() => onChange("kycManagement", "isDelete")} />
                                            </Col>
                                        </Row>
                                        <Row gutter={30} style={{ marginTop: "15px" }}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                Token Management
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.tokenManagement.isWrite} onChange={() => onChange("tokenManagement", "isWrite")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.tokenManagement.isRead} onChange={() => onChange("tokenManagement", "isRead")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.tokenManagement.isUpdate} onChange={() => onChange("tokenManagement", "isUpdate")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.tokenManagement.isDelete} onChange={() => onChange("tokenManagement", "isDelete")} />
                                            </Col>
                                        </Row>

                                        <Row gutter={30} style={{ marginTop: "15px" }}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                User Management
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.userManagement.isWrite} onChange={() => onChange("userManagement", "isWrite")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.userManagement.isRead} onChange={() => onChange("userManagement", "isRead")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.userManagement.isUpdate} onChange={() => onChange("userManagement", "isUpdate")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.userManagement.isDelete} onChange={() => onChange("userManagement", "isDelete")} />
                                            </Col>
                                        </Row>

                                        <Row gutter={30} style={{ marginTop: "15px" }}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                Sub Admin Management
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.subadminManagement.isWrite} onChange={() => onChange("subadminManagement", "isWrite")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.subadminManagement.isRead} onChange={() => onChange("subadminManagement", "isRead")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.subadminManagement.isUpdate} onChange={() => onChange("subadminManagement", "isUpdate")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.subadminManagement.isDelete} onChange={() => onChange("subadminManagement", "isDelete")} />
                                            </Col>
                                        </Row>

                                        <Row gutter={30} style={{ marginTop: "15px" }}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                Sus Bsciption Management
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.susbsciptionManagement.isWrite} onChange={() => onChange("susbsciptionManagement", "isWrite")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.susbsciptionManagement.isRead} onChange={() => onChange("susbsciptionManagement", "isRead")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.susbsciptionManagement.isUpdate} onChange={() => onChange("susbsciptionManagement", "isUpdate")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.susbsciptionManagement.isDelete} onChange={() => onChange("susbsciptionManagement", "isDelete")} />
                                            </Col>
                                        </Row>

                                        <Row gutter={30} style={{ marginTop: "15px" }}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                Contract Sniffer Management
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.contractSnifferManagement.isWrite} onChange={() => onChange("contractSnifferManagement", "isWrite")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.contractSnifferManagement.isRead} onChange={() => onChange("contractSnifferManagement", "isRead")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.contractSnifferManagement.isUpdate} onChange={() => onChange("contractSnifferManagement", "isUpdate")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.contractSnifferManagement.isDelete} onChange={() => onChange("contractSnifferManagement", "isDelete")} />
                                            </Col>
                                        </Row>

                                        <Row gutter={30} style={{ marginTop: "15px" }}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                Advertizements Management
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.advertisementManagement.isWrite} onChange={() => onChange("advertisementManagement", "isWrite")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.advertisementManagement.isRead} onChange={() => onChange("advertisementManagement", "isRead")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.advertisementManagement.isUpdate} onChange={() => onChange("advertisementManagement", "isUpdate")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.advertisementManagement.isDelete} onChange={() => onChange("advertisementManagement", "isDelete")} />
                                            </Col>
                                        </Row>

                                        <Row gutter={30} style={{ marginTop: "15px" }}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                static Content Management
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.staticContentManagement.isWrite} onChange={() => onChange("staticContentManagement", "isWrite")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.staticContentManagement.isRead} onChange={() => onChange("staticContentManagement", "isRead")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.staticContentManagement.isUpdate} onChange={() => onChange("staticContentManagement", "isUpdate")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.staticContentManagement.isDelete} onChange={() => onChange("staticContentManagement", "isDelete")} />
                                            </Col>
                                        </Row>

                                        <Row gutter={30} style={{ marginTop: "15px" }}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                help Center Management
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.helpCenterManagement.isWrite} onChange={() => onChange("helpCenterManagement", "isWrite")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.helpCenterManagement.isRead} onChange={() => onChange("helpCenterManagement", "isRead")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.helpCenterManagement.isUpdate} onChange={() => onChange("helpCenterManagement", "isUpdate")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.helpCenterManagement.isDelete} onChange={() => onChange("helpCenterManagement", "isDelete")} />
                                            </Col>
                                        </Row>


                                        <Row gutter={30} style={{ marginTop: "15px" }}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                Announcement Management
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.announcementManagement.isWrite} onChange={() => onChange("announcementManagement", "isWrite")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.announcementManagement.isRead} onChange={() => onChange("announcementManagement", "isRead")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.announcementManagement.isUpdate} onChange={() => onChange("announcementManagement", "isUpdate")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.announcementManagement.isDelete} onChange={() => onChange("announcementManagement", "isDelete")} />
                                            </Col>
                                        </Row>

                                        <Row gutter={30} style={{ marginTop: "15px" }}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                blog Management
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.blogManagement.isWrite} onChange={() => onChange("blogManagement", "isWrite")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.blogManagement.isRead} onChange={() => onChange("blogManagement", "isRead")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.blogManagement.isUpdate} onChange={() => onChange("blogManagement", "isUpdate")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.blogManagement.isDelete} onChange={() => onChange("blogManagement", "isDelete")} />
                                            </Col>
                                        </Row>

                                        <Row gutter={30} style={{ marginTop: "15px" }}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                news Management
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.newsManagement.isWrite} onChange={() => onChange("newsManagement", "isWrite")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.newsManagement.isRead} onChange={() => onChange("newsManagement", "isRead")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.newsManagement.isUpdate} onChange={() => onChange("newsManagement", "isUpdate")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.newsManagement.isDelete} onChange={() => onChange("newsManagement", "isDelete")} />
                                            </Col>
                                        </Row>

                                        <Row gutter={30} style={{ marginTop: "15px" }}>
                                            <Col md={8} xs={24} style={{
                                                color: "#272B41", fontWeight: 500, fontSize: "16px"
                                            }}>
                                                Sponsor Management
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.sponsorManagement.isWrite} onChange={() => onChange("sponsorManagement", "isWrite")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.sponsorManagement.isRead} onChange={() => onChange("sponsorManagement", "isRead")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.sponsorManagement.isUpdate} onChange={() => onChange("sponsorManagement", "isUpdate")} />
                                            </Col>
                                            <Col md={4} xs={24} style={{ textAlign: 'center' }}>
                                                <Checkbox checked={permission?.sponsorManagement.isDelete} onChange={() => onChange("sponsorManagement", "isDelete")} />
                                            </Col>
                                        </Row>



                                        <div className="sDash_form-action mt-20">
                                            <Button htmlType="submit" type="primary" size="large">
                                                Submit Form
                                            </Button>
                                        </div>
                                    </Form>}
                                </Cards>
                            </VerticalFormStyleWrap>
                        </FormValidationWrap>
                    </Col>
                </Row>
            </Main>


        </>
    );
};

export default EditSubAdmin;
