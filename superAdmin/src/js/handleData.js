import $ from 'jquery';
const echarts = require('echarts');
import {comfirmFlag, $comfirmFrame} from './comfirm';
// 定义全局变量
const $myPage = $('#zzl-page'); // 页面包裹元素
const $breadcrumb = $('.breadcrumb li') // 路径导航条
const $navApply = $('.nav-apply'); // 侧边栏审核管理
const $userApply = $('.user-apply') // 侧边用户审核管理
const $bannerApply = $('.banner-apply') // 侧边栏轮播图审核管理
const $skinBtn = $('.skin .btn'); // 获取换肤按钮
const $pageBtns = $('.home-data'); // 获取主页的四个按钮
const $comfirmBtn = $('.alert .comfirm');
const $tempImgContainer = $('.img-container');
const $container = $tempImgContainer.find('.container');
let userInformationPageIndex = 0;
let userApplyPageIndex = 0;
let bannerApplyPageIndex = 0;
const Authorization = localStorage.getItem('Authorization');
const superAdminId = localStorage.getItem('superAdminId');
const domainName= "http://10.21.23.177:8080/";
let springNum = 1;
const allUrl = {
    changeCommunityStatusUrl: domainName + 'superAdmin/changeCommunityStatus',
    bannerItemsUrl: domainName + 'superAdmin/bannerItems',
    deleteBanner: domainName + 'superAdmin/deleteBanner',
    changeBannerStatus: domainName + 'superAdmin/changeBannerStatus',
    replaceDisplayBanner: domainName + 'superAdmin/replaceDisplayBanner',
    obtainDesignatedItem: domainName + 'superAdmin/obtainDesignatedItem',
    getBannerNum: domainName + 'superAdmin/getBannerNum',
    deleteCommunity: domainName + 'superAdmin/deleteCommunity',
    getAllCommunityNum: domainName + 'superAdmin/getAllCommunityNum',
};
// 定义一个对象，专门用于存储处理数据的函数
const handleData = {
    // 序列化函数
    serial: ($obj) => {
        const $serialEle = $obj.find('.serial-num');
        $serialEle.each((key, item) => {
            item.innerHTML = key + 1;
        })
    },
    // 一键换肤功能
    switchingSkin: () => {
        $myPage.toggleClass('normal')
        if ($skinBtn.text() == '夜间模式') {
            $skinBtn.text('日间模式');
        } else {
            $skinBtn.text('夜间模式');
        }
    },
    // 首页扇形图表
    echartStr: (names, brower) => {
        let myChart;
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();
        }
        myChart = echarts.init(document.getElementById('main'));
        const option = {
            title: {
                text: '数据可视化中心',
                x: 'center',
                textStyle: {
                    color: "white"
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: names,
                textStyle: {
                    color: "white"
                },
                top: 30
            },
            color: ['#449D88', '#406cb8', '#c0444c', '#4c4c4c'],
            series: [{
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: brower,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    normal: {
                        show: false,
                    }
                },
            }]
        };
        myChart.setOption(option);
    },
    // 侧边栏颜色控制
    resetColor: ($obj) => {
        $obj.parents('.list-group').eq(1).find('.detail').css({
            color: "rgb(120, 117, 117)"
        });
        $obj.css({
            color: "#25a7ab"
        });
    },
    // 主页切换页面
    changePage: ($nav, $pageBtn, $page) => {
        $nav.slideDown().siblings('.row').slideUp();
        $nav.prev().siblings('.list-group-item').find('.toggle').removeClass('glyphicon-minus');
        $nav.prev().find('.toggle').addClass('glyphicon-minus');
        handleData.sideControl($pageBtn, $page);
        $pageBtn.trigger('click');
        $pageBtn.parents('.row').eq(0).prev().addClass('active').siblings().removeClass('active');
        $breadcrumb.eq(1).removeClass('active').html('<a href="javascript:;">' + $pageBtn.parents('.side').find('.active').find('.text').text() + '</a>').show();
        $breadcrumb.eq(2).addClass('active').show().html($pageBtn.find('.text').text());
    },
    // 生成首页图表数据
    sector: () => {
        // 定义两个数组，分别存储数目和名称，用于扇形图表
        let brower = [],
            names = ["用户人数", "轮播图数目", "待审核社团", "待审核轮播图"];
        // 存储待审核总数目
        let applyNum = 0;
        // 利用promise对象，完成异步操作
        const loadData = (url) => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: 'get',
                    headers: {Authorization},
                    url,
                    data: {
                        status: 1 
                    },
                    success: function (result) {
                        $pageBtns.eq(0).find('.num').html(result.object.allCommunityNum);
                        brower.push({
                            name: names[0],
                            value: result.object.allCommunityNum
                        });
                        resolve();
                    },
                    error: function (errorMsg) {
                        alert("请求数据失败!");
                        reject();
                    }
                });
            })
        };
        loadData(allUrl.getAllCommunityNum)
            .then(() => {
                let data = {
                    status: 3
                };
                $.ajax({
                    type: 'get',
                    url: allUrl.getBannerNum,
                    headers: {Authorization},
                    data,
                    success: function (result) {
                        $pageBtns.eq(1).find('.banner-num').html(result.object.bannerNum);
                        brower.push({
                            name: names[1],
                            value: result.object.bannerNum
                        });
                    },
                    error: function (errorMsg) {
                        alert("请求数据失败!");
                    }
                });
            }, () => {

            })
            .then(() => {
                let data = {
                    status: 0
                };
                $.ajax({
                    type: 'get',
                    url: allUrl.getAllCommunityNum,
                    headers: {Authorization},
                    data,
                    success: function (result) {
                        let registerLen = result.object.allCommunityNum;
                        applyNum = registerLen;
                        if (registerLen > 0) {
                            $userApply.find('.badge').html(registerLen)
                        } else {
                            $userApply.find('.badge').hide();
                        }
                        $pageBtns.eq(2).find('.user-apply-num').html(registerLen);
                        brower.push({
                            name: names[2],
                            value: registerLen
                        });
                    },
                    error: function (errorMsg) {
                        alert("请求数据失败!");
                    }
                });
            }, () => {

            })
            .then(() => {
                let data = {
                    status: 0
                };
                
                $.ajax({
                    type: 'get',
                    url: allUrl.getBannerNum,
                    headers: {Authorization},
                    data,
                    success: function (result) {
                        let tempBannersLen = result.object.bannerNum;
                        applyNum += tempBannersLen;
                        if (tempBannersLen > 0) {
                            $bannerApply.find('.badge').html(tempBannersLen);
                        } else {
                            $bannerApply.find('.badge').hide();
                        }
                        if (applyNum > 0) {
                            $navApply.find('.badge').html(applyNum)
                        } else {
                            $navApply.find('.badge').hide();
                        }
                        $pageBtns.eq(3).find('.banner-apply-num').html(tempBannersLen);
                        brower.push({
                            name: names[3],
                            value: tempBannersLen
                        });
                        handleData.echartStr(names, brower);
                    },
                    error: function (errorMsg) {
                        alert("请求数据失败!");
                    }
                });
            }, () => {});
    },
    // 生成用户管理界面初始化数据
    initUserInformation: ($tbody, url, data, status, $allPage, searchName) => {
        $.ajax({
            type: 'get',
            url,
            data,
            dataType: "json",
            headers: {
                Authorization
            },
            success: function (result) {
                $tbody.html("");
                $(result.object).each((key, item) => {
                    let $item = '<tr>' +
                        '<td>' +
                        '<div class="checkbox radio">' +
                        '<label>' +
                        '<input type="checkbox">' +
                        '</label>' +
                        '</div>' +
                        '</td>' +
                        '<td class="serial-num">' + (key + 1) + '</td>' +
                        '<td class="community-name">' + item.communityName + '</td>' +
                        '<td class="admin-name">' + item.adminName + '</td>' +
                        '<td class="student-number">' + item.adminStudentNumber + '</td>' +
                        '<td class="student-phone">' + item.adminStudentPhone + '</td>' +
                        '<td class="community-id" style="display:none;">' + item.communityId + '</td>' +
                        '<td><button type="button" class="btn btn-danger ">删除</button></td>' +
                        '</tr>';
                    $tbody.append($item);
                });
                let url = allUrl.getAllCommunityNum;
                    let data = {
                        status,
                        name: searchName
                    };
                handleData.getAllCommunityPageNum(url, data, $allPage);
            },
            error: function (errorMsg) {
                alert('请求数据失败，请检查网络情况');
            }
        });

    },
    // 生成轮播图管理界面的初始化数据
    initBannerManagePage: (url, $tbody, data) => {
        $.ajax({
            type: 'get',
            url,
            data,
            headers: {Authorization},
            dataType: "json",
            success: function (result) {
                $tbody.html("");
                $(result.object).each((key, item) => {
                    let $item = '<tr class="showing">' +
                        '<td class="serial-num">' + (key + 1) + '</td>' +
                        '<td class="showing-commuity-name">' + item.communityName + '</td>' +
                        '<td class="showing-username">' + item.communityAdminName + '</td>' +
                        '<td class="showing-banner-id" style="display:none;">' + item.bannerId + '</td>' +
                        '<td class="showing-id" style="display:none;">' + item.communityId + '</td>' +
                        '<td><a href="javascript:;" class="thumbnail">' +
                        '<img class="img-scale displaying" style="width: 8vw;" src="' + item.fileName + '" alt="...">' +
                        '</a></td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-info preview">预览</button>' +
                        '<button type="button" class="btn btn-primary replace">替换</button>' +
                        '<button type="button" class="btn btn-danger delete-showing">删除</button>' +
                        '</td>' +
                        '</tr>';
                    $tbody.append($item);
                });
            },
            error: function (errorMsg) {
                alert("请求数据失败!");
            }
        });
    },
    // 初始化用户审核界面数据
    initUserApply: (url, $tbody, data, status, $allPage) => {
        $.ajax({
            type: 'get',
            url,
            dataType: "json",
            data,
            headers: {
                Authorization
            },
            success: function (result) {
                $tbody.html("");
                $(result.object).each((key, item) => {
                    let $item = '<tr>' +
                        '<td>' +
                        '<div class="checkbox radio">' +
                        '<label>' +
                        '<input type="checkbox">' +
                        '</label>' +
                        '</div>' +
                        '</td>' +
                        '<td class="serial-num">' + (key + 1) + '</td>' +
                        '<td class="comunity-name">' + item.communityName + '</td>' +
                        '<td class="username">' + item.adminName + '</td>' +
                        '<td class="userphone">' + item.adminStudentPhone + '</td>' +
                        '<td class="student-num">' + item.adminStudentNumber + '</td>' +
                        '<td class="community-id" style="display:none;">' + item.communityId + '</td>' +
                        '<td><a href="javascript:;" class="thumbnail">' +
                        '<img class="img-scale community-src" style="width: 8vw;" src="' + item.src + '" alt="...">' +
                        '</a></td>' +
                        '<td><button type="button" class="btn btn-success success ">通过</button>&nbsp;&nbsp;&nbsp;<button type="button"' +
                        'class="btn btn-danger delete">删除</button></td>' +
                        '</tr>';
                    $tbody.append($item);
                    $navApply.find('.badge').html('');
                })
                let url = allUrl.getAllCommunityNum;
                let data = {
                    status
                };
                handleData.getAllCommunityPageNum(url, data, $allPage);
            },
            error: function (errorMsg) {
                alert('请求数据失败，请检查网络情况');
            }
        });
    },
    
    // 初始化轮播图审核界面数据
    initBannerApply: (url, $tbody, data, status, $allPage) => {
        $.ajax({
            type: 'get',
            url,
            dataType: "json",
            data,
            headers: {Authorization},
            success: function (result) {
                console.log(result)
                $tbody.html("");
                $(result.object).each((key, item) => {
                    let $item = '<tr class="auditing">' +
                        '<td>' +
                        '<div class="checkbox radio">' +
                        '<label>' +
                        '<input type="checkbox">' +
                        '</label>' +
                        '</div>' +
                        '</td>' +
                        '<td class="serial-num">' + (key + 1) + '</td>' +
                        '<td class="auditing-commuity-name">' + item.communityName + '</td>' +
                        '<td class="auditing-username">' + item.communityAdminName + '</td>' +
                        '<td class="auditing-banner-id" style="display:none">' + item.bannerId + '</td>' +
                        '<td class="auditing-id" style="display: none;">' + item.communityId + '</td>' +
                        '<td><a href="javascript:;" class="thumbnail">' +
                        '<img class="img-scale auditing" style="width: 8vw;" src="' + item.fileName + '" alt="...">' +
                        '</a></td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-info preview">预览</button>' +
                        '<button type="button" class="btn btn-primary success">通过</button>' +
                        '<button type="button" class="btn btn-danger delete">删除</button>' +
                        '</td>' +
                        '</tr>';
                    $tbody.append($item);
                    $navApply.find('.badge').html('');
                });
                let url = allUrl.getBannerNum;
                let data = {
                    status
                };
                console.log(data)
                handleData.getAllBannnerPageNum(url, data, $allPage);
            },
            error: function (errorMsg) {
                alert("请求数据失败!");
            }
        });
    },
    // 用户管理界面分页功能
    // 下一页
    handleNextPage($obj, totalPage, $tbody, $currentPage, url, status, $allPage) {
        $obj.siblings('li').removeClass('disabled');
        if (userInformationPageIndex >= totalPage - 1) {
            userInformationPageIndex = totalPage - 1;
            $obj.addClass('disabled');
        } else {
            userInformationPageIndex++;
            $currentPage.html(userInformationPageIndex + 1);
            $obj.removeClass('disabled');
            let data = {
                status: 1,
                page: userInformationPageIndex + 1
            }
            handleData.initUserInformation($tbody, url, data, status, $allPage);
        }
    },
    // 上一页
    handlePrePage($obj, $tbody, $currentPage, url, status, $allPage) {
        $obj.siblings('li').removeClass('disabled');
        if (userInformationPageIndex <= 0) {
            userInformationPageIndex = 0;
            $obj.addClass('disabled');
        } else {
            userInformationPageIndex--;
            $currentPage.html(userInformationPageIndex + 1);
            $obj.removeClass('disabled');
            let data = {
                status: 1,
                page: userInformationPageIndex + 1
            }
            handleData.initUserInformation($tbody, url, data, status, $allPage);
        }
    },
    // 点击删除单个元素, 删除后应该重新获取数据
    deleteOneItem: ($obj, $delegate, url, data, $tbody, page, status, $allPage) => {
            $.ajax({
                type: "get",
                headers: {
                    Authorization
                },
                url,
                data,
                success: function (response) {
                    let data = {
                    };
                    let url;
                    $obj.parents('tr').remove();
                    switch ($delegate.get(0).id) {
                        case "user-information":
                            data = {
                                page,
                                status: 1
                            };
                            url = allUrl.obtainDesignatedItem;
                            handleData.initUserInformation($tbody, url, data, status, $allPage);
                            handleData.serial($delegate);
                            break;
                        case "banner-manage":
                            data = {
                                page,
                                status: 3
                            };
                            url = allUrl.bannerItemsUrl;
                            handleData.initBannerManagePage(url, $tbody, data);
                            handleData.serial($delegate);

                            break;
                        case "user-apply":
                            data = {
                                page,
                                status: 0
                            };
                            url = allUrl.obtainDesignatedItem;
                            handleData.initUserApply(url, $tbody, data, status, $allPage);
                            handleData.serial($delegate);
                            break;
                        case "banner-apply":
                            data = {
                                page,
                                status: 0
                            };
                            url = allUrl.bannerItemsUrl;
                            handleData.initBannerApply(url, $tbody, data, status, $allPage);
                            handleData.serial($delegate);
                            break;
                        default:
                            break;
                    }
                }
            });
           
    },
    // 删除已选中的元素
    deleteAllCheckedItems: (arr, $checkAll, $delegate, url, page, status, $allPage) => {
            let $tbody = $(arr[0]).parents('tbody');
            let data;
            for(var i = 0; i < arr.length - 1; i++) {
                data = {
                    communityId: parseInt($(arr[i]).find('.community-id').html())
                };
                $.ajax({
                    type: "get",
                    url,
                    data,
                    headers:{Authorization},
                    success: function (response) {
                    }
                });
            }
            switch ($delegate.get(0).id) {
                case "user-information":
                    data = {
                        page,
                        status: 1
                    };
                    url = allUrl.obtainDesignatedItem;
                    handleData.initUserInformation($tbody, url, data, status, $allPage);
                    break;
                case "banner-manage":
                    data = {
                        page,
                        status: 3
                    };
                    url = allUrl.bannerItemsUrl;
                    handleData.initBannerManagePage(url, $tbody, data);
                    break;
                case "user-apply":
                    data = {
                        page,
                        status: 0
                    };
                    url = allUrl.obtainDesignatedItem;
                    handleData.initUserApply(url, $tbody, data, status, $allPage);
                    break;
                case "banner-apply":
                    data = {
                        page,
                        status: 0
                    };
                    url = allUrl.bannerItemsUrl;
                    handleData.initBannerApply(url, $tbody, data, status, $allPage);
                    break;
                default:
                    break;
            }
            arr.remove();
            arr = "";
        if ($checkAll.children().prop('checked')) {
            $checkAll.children().prop('checked', false);
        }
        handleData.serial($delegate);
    },
    // 通过已选中的元素
    passAllCheckedItems: (arr, $checkAll, $delegate, url, page, status, $allPage) => {
            let idArr = [];
            for(let i = 0; i < arr.length; i++) {
                idArr.push(parseInt($(arr[i]).find('.community-id').html()))
            }
            let $tbody = $(arr[0]).parents('tbody');
            let data;
            switch ($delegate.get(0).id) {
                case "user-apply":
                        for(var i = 0; i < arr.length - 1; i++) {
                            data = {
                                communityId: idArr[i],
                                status:1
                            };
                            $.ajax({
                                type: "get",
                                url,
                                data,
                                headers:{Authorization},
                                success: function (response) {
                                }
                            });
                        }
                    data = {
                        page,
                        status: 0
                    };
                    url = allUrl.obtainDesignatedItem;
                    handleData.initUserApply(url, $tbody, data, status, $allPage);
                    break;
                case "banner-apply":
                    for(var i = 0; i < arr.length - 1; i++) {
                        data = {
                            bannerId: parseInt($(arr[i]).find('.auditing-banner-id').html()),
                            status:1
                        };
                        $.ajax({
                            type: "get",
                            url,
                            data,
                            headers:{Authorization},
                            success: function (response) {
                            }
                        });
                    }
                    data = {
                        page,
                        status: 0
                    };
                    url = allUrl.bannerItemsUrl;
                    handleData.initBannerApply(url, $tbody, data, status, $allPage);
                    break;
                default:
                    break;
            }
            arr.remove();
            arr = "";
        if ($checkAll.children().prop('checked')) {
            $checkAll.children().prop('checked', false);
        }
        handleData.serial($delegate);
    },
    // 确认删除一个元素
    handleComfirm: ($obj,$delegate, url, data, $tbody, page, status, $allPage) => {
        $comfirmBtn.one('click',  () => {
           $comfirmFrame.hide();
           handleData.deleteOneItem($obj, $delegate,url, data, $tbody, page, status, $allPage);
           if ($allPage) {
            $allPage.siblings().html(page);
           }
        });
   },
   // 确认多个删除
   handleComfirmAll: (arr, $checkAll, $delegate, url, page, status, $allPage, flag) => {
        $comfirmBtn.one('click',  () => {
            $comfirmFrame.hide();
            if (flag) {
                // 表示删除
                handleData.deleteAllCheckedItems(arr, $checkAll, $delegate, url, page, status, $allPage);

            } else {
                handleData.passAllCheckedItems(arr, $checkAll, $delegate, url, page, status, $allPage)
            }
        });
    },
    // 改变单选框的状态及全选框的状态
    changeItemState: ($obj, $checkAll, $delegate) => {
        let flag = true;
        if ($obj.children().prop('checked')) {
            $obj.addClass('active');
        } else {
            $obj.removeClass('active');
            $checkAll.children().prop('checked', false);
        }
        $delegate.find('.radio input').each((key, item) => {
            if (!$(item).prop('checked')) {
                flag = false;
            }
        });
        $checkAll.children().prop('checked', flag);

    },
    // 全选
    checkAllItems: ($obj, $delegate) => {
        let $radios = $delegate.find('.radio label input');
        let $labels = $delegate.find('.radio label');
        if ($obj.children().prop('checked')) {
            $radios.each((key, value) => {
                $(value).prop("checked", true);
            });
            $labels.addClass('active');
        } else {
            $radios.each((key, value) => {
                $(value).prop("checked", false);
            });
            $labels.removeClass('active');
        }
    },
    // 侧边栏管理(切换页面)
    sideControl: ($obj, $page) => {
        handleData.resetColor($obj)
        $page.siblings('.manage').fadeOut();
        $page.fadeIn();
        $breadcrumb.eq(1).removeClass('active').show().html('<a href="javascript:;">' + $obj.parents('.side').find('.active').find('.text').text() + '</a>');
        $breadcrumb.eq(2).addClass('active').show().html($obj.find('.text').text());
    },
    // 侧边栏主管理(不切换界面)
    mianControl: ($obj) => {
        $obj.toggleClass('active');
        $obj.find('.toggle').toggleClass('glyphicon-minus');
        $obj.find('.badge').hide();
        $obj.siblings().removeClass('active');
        $obj.siblings().find('.toggle').removeClass('glyphicon-minus');
    },
    // 轮播图容器函数：参数一：触发事件的对象；参数二：最外层包裹容器；参数三：内部图片容器；参数四：点击的正在展示的那一张轮播图元素
    showTempBannerWindow: ($obj, url, data, $wrapContainer, $rightContainer, $currentItem) => {
        $wrapContainer.fadeIn();
        $currentItem = $obj.parents('tr');
        $.ajax({
            type: 'get',
            url,
            data,
            headers:{Authorization},
            success: function (result) {
                console.log(result)
                $(result.object).each((key, item) => {
                    let $item = '<div class="col-sm-6 col-md-4 temp">' +
                        '<div class="thumbnail">' +
                        '<img src="' + item.fileName + '" alt="...">' +
                        '<div class="caption">' +
                        '<h3 class="commuity-name">' + item.communityName + '</h3>' +
                        '<p class="username">' + item.communityAdminName + '</p>' +
                        '<p class="comunity-id hide">' + item.communityId + '</p>' +
                        '<p class="banner-id hide">' + item.bannerId + '</p>' +
                        '<p><a href="javascript:;" class="btn btn-primary comfirm-replace" role="button">替换</a>' +
                        '<a href="javascript:;" class="btn btn-success comfirm-add" role="button">添加</a></p>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    $rightContainer.append($item);
                });
                console.log($currentItem)
                if ($obj.hasClass('add')) {
                    $('.comfirm-add').show();
                    $('.comfirm-replace').hide();
                } else {
                    $('.comfirm-add').hide();
                    $('.comfirm-replace').show();
                }
            },
            error: function (errorMsg) {
                alert("请求数据失败!");
            }
        });
        return $currentItem;
    },
    // 轮播图控制函数
    bannerControl: ($tempItem, $current, tempBannerData, showingBannerData, bool, $tbody, url, data) => {
        // 获取容器中被点击的元素的信息
        let commuityName = $tempItem.find('.commuity-name'),
            username = $tempItem.find('.username'),
            comunityId = $tempItem.find('.comunity-id'),
            bannerId = $tempItem.find('.banner-id'),
            tempUrl = $tempItem.find('img');
        tempBannerData = {
            commuityName: commuityName.text(),
            username: username.text(),
            comunityId: comunityId.text(),
            bannerId: bannerId.text(),
            tempUrl: tempUrl.attr('src')
        };
        data.bannerId = parseInt(tempBannerData.bannerId);
        // 获取展示中的轮播图的信息
        // 代表添加
        if (bool) {
            $.ajax({
                type: "get",
                url,
                data,
                headers: {Authorization},
                success: function (response) {
                    let data = {
                        page: 1,
                        status: 3
                    };
                    let url = allUrl.bannerItemsUrl;
                    handleData.initBannerManagePage(url, $tbody, data)
                }
            });
        } else {
            //代表替换
            let showingCommuityName = $current.find('.showing-commuity-name'),
                showingUsername = $current.find('.showing-username'),
                showingId = $current.find('.showing-id'),
                showingBannerId = $current.find('.showing-banner-id'),
                showingUrl = $current.find('img');
            showingBannerData = {
                showingCommuityName: showingCommuityName.text(),
                showingUsername: showingUsername.text(),
                showingId: showingId.text(),
                showingBannerId: showingBannerId.text(),
                showingUrl: showingUrl.attr('src')
            };
            data = {
                replacedBannerId: parseInt(showingBannerData.showingBannerId),
                replaceBannerId: parseInt(tempBannerData.bannerId)
            };
            $.ajax({
                type: "get",
                url,
                data,
                headers: {Authorization},
                success: function (response) {
                    let data = {
                        page: 1,
                        status: 3
                    };
                    let url = allUrl.bannerItemsUrl;
                    handleData.initBannerManagePage(url, $tbody, data)
                }
            });
        }
    },
    // 确认替换或者添加轮播图控制函数
    comfirmBannerControl: ($obj,$current,tempBannerData,showingBannerData,bool, $tbody, url, data, status) => {
        $comfirmBtn.one('click',  () => {
           $comfirmFrame.hide();
           handleData.bannerControl($obj, $current, tempBannerData, showingBannerData, bool, $tbody, url, data, status);
           $tempImgContainer.fadeOut();
           $container.html("");
        });
   },
    // 自定义添加按钮
    customBtn: (e, $obj) => {
        let $ball = $('<span class="box"></span>');
        let left = e.pageX - $obj.get(0).offsetLeft;
        let top = e.pageY - $obj.get(0).offsetTop;
        $ball.css({
            'left': 57 + 'px',
            'top': top + 'px'
        });
        $obj.append($ball);
        $ball.on('animationend', function () {
            //每次在执行完动画把“水波”从文档中移出；
            $ball.remove();
        });
    },
    // 控制侧边栏社团管理下拉
    controlSlide: ($nav, $obj) => {
        $nav.slideToggle().siblings('.row').slideUp();
        if (!$breadcrumb.eq(2).hasClass('active')) {
            $breadcrumb.eq(1).addClass('active').show().html($obj.find('.text').text());
        }
    },
    // 获取不同状态的用户数量，同时进行分页
    getAllCommunityPageNum: (url, data, $allPage) => {
        let allCommunityNum;
        $.ajax({
            type: "get",
            url,
            data,
            headers: {Authorization},
            success: function (response) {
                allCommunityNum = response.object.allCommunityNum
                if (allCommunityNum <= 0) {
                    allCommunityNum = 1;
                }
                allCommunityNum = Math.ceil(allCommunityNum / 12);
                $allPage.html(allCommunityNum)
            }
        });
    },
    // 获取不同状态的轮播图数量，同时进行分页
    getAllBannnerPageNum: (url, data, $allPage) => {
            $.ajax({
                type: "get",
                url,
                data,
                headers: {Authorization},
                success: function (response) {
                    console.log(response)
                    let bannerNum = response.object.bannerNum
                    if (bannerNum <= 0) {
                        bannerNum = 1;
                    }
                    bannerNum = Math.ceil(bannerNum / 15);
                    if ($allPage) {
                        $allPage.html(bannerNum)
                    } else {
                        springNum = Math.ceil(response.object.bannerNum / 15);
                    }
                    
                }
            });
        
    },
    // 用户信息管理模糊搜索
    serach: (searchName,url,$tbody,$allPage) => {
        const data = {
            searchName,
            status: 1,
            page:1
          };
        userInformationPageIndex = 0;
        $.ajax({
            type: "get",
            url,
            data,
            headers:{Authorization},
            success: function (result) {
                $tbody.html("");
                if (result.object.length > 0) {
                    $(result.object).each((key, item) => {
                        let $item = '<tr>' +
                            '<td>' +
                            '<div class="checkbox radio">' +
                            '<label>' +
                            '<input type="checkbox">' +
                            '</label>' +
                            '</div>' +
                            '</td>' +
                            '<td class="serial-num">' + (key + 1) + '</td>' +
                            '<td class="community-name">' + item.communityName + '</td>' +
                            '<td class="admin-name">' + item.adminName + '</td>' +
                            '<td class="student-number">' + item.adminStudentNumber + '</td>' +
                            '<td class="student-phone">' + item.adminStudentPhone + '</td>' +
                            '<td class="community-id" style="display:none;">' + item.communityId + '</td>' +
                            '<td><button type="button" class="btn btn-danger ">删除</button></td>' +
                            '</tr>';
                        $tbody.append($item);
                    });
                } else {
                    $tbody.html("<p style='color:red;'>搜索不到结果，请换一个名字搜索吧!</p>");
                }
                let url = allUrl.getAllCommunityNum;
                let data = {
                    status: 1,
                    name: searchName
                };
                handleData.getAllCommunityPageNum(url, data, $allPage);
            }
        });
    },
    // 用户审核分页功能
    // 下一页
    handleApplyNextPage($obj, totalPage, $tbody, $currentPage, url, status, $allPage) {
        $obj.siblings('li').removeClass('disabled');
        if (userApplyPageIndex >= totalPage - 1) {
            userApplyPageIndex = totalPage - 1;
            $obj.addClass('disabled');
        } else {
            userApplyPageIndex++;
            $currentPage.html(userApplyPageIndex + 1);
            $obj.removeClass('disabled');
            let data = {
                status: 0,
                page: userApplyPageIndex + 1
            }
            handleData.initUserApply(url, $tbody, data, status, $allPage);
        }
    },
    // 上一页
    handleApplyPrePage($obj, $tbody, $currentPage, url, status, $allPage) {
        $obj.siblings('li').removeClass('disabled');
        if (userApplyPageIndex <= 0) {
            userApplyPageIndex = 0;
            $obj.addClass('disabled');
        } else {
            userApplyPageIndex--;
            $currentPage.html(userApplyPageIndex + 1);
            $obj.removeClass('disabled');
            let data = {
                status: 0,
                page: userApplyPageIndex + 1
            }
            handleData.initUserApply(url, $tbody, data, status, $allPage);
        }
    },
     // 轮播图审核分页功能
    // 下一页
    handleBannerApplyNextPage($obj, totalPage, $tbody, $currentPage, url, status, $allPage) {
        $obj.siblings('li').removeClass('disabled');
        if (bannerApplyPageIndex >= totalPage - 1) {
            bannerApplyPageIndex = totalPage - 1;
            $obj.addClass('disabled');
        } else {
            bannerApplyPageIndex++;
            $currentPage.html(bannerApplyPageIndex + 1);
            $obj.removeClass('disabled');
            let data = {
                status: 0,
                page: bannerApplyPageIndex + 1
            }
            handleData.initBannerApply(url, $tbody, data, status, $allPage);
        }
    },
    // 上一页
    handleBannerApplyPrePage($obj, $tbody, $currentPage, url, status, $allPage) {
        $obj.siblings('li').removeClass('disabled');
        if (bannerApplyPageIndex <= 0) {
            bannerApplyPageIndex = 0;
            $obj.addClass('disabled');
        } else {
            bannerApplyPageIndex--;
            $currentPage.html(bannerApplyPageIndex + 1);
            $obj.removeClass('disabled');
            let data = {
                status: 0,
                page: bannerApplyPageIndex + 1
            }
            handleData.initBannerApply(url, $tbody, data, status, $allPage);
        }
    },
    // 搜索的分页功能
    // 下一页
    handleSearchNextPage($obj, totalPage, $tbody, $currentPage, url, status, $allPage, searchName) {
        $obj.siblings('li').removeClass('disabled');
        if (userInformationPageIndex >= totalPage - 1) {
            userInformationPageIndex = totalPage - 1;
            $obj.addClass('disabled');
        } else {
            userInformationPageIndex++;
            $currentPage.html(userInformationPageIndex + 1);
            $obj.removeClass('disabled');
            let data = {
                status: 1,
                page: userInformationPageIndex + 1,
                searchName
            }
            handleData.initUserInformation($tbody, url, data, status, $allPage,searchName);
        }
    },
    // 上一页
    handleSearchPrePage($obj, $tbody, $currentPage, url, status, $allPage, searchName) {
        $obj.siblings('li').removeClass('disabled');
        if (userInformationPageIndex <= 0) {
            userInformationPageIndex = 0;
            $obj.addClass('disabled');
        } else {
            userInformationPageIndex--;
            $currentPage.html(userInformationPageIndex + 1);
            $obj.removeClass('disabled');
            let data = {
                status: 1,
                page: userInformationPageIndex + 1,
                searchName
            }
            handleData.initUserInformation($tbody, url, data, status, $allPage, searchName);
        }
    },
     // 轮播图容器分页功能（瀑布流）
    // 下一页
    handleBannerCantainNextPage($obj, totalPage, $tbody, $currentPage, url, status, $allPage) {
        $obj.siblings('li').removeClass('disabled');
        if (bannerApplyPageIndex >= totalPage - 1) {
            bannerApplyPageIndex = totalPage - 1;
            $obj.addClass('disabled');
        } else {
            bannerApplyPageIndex++;
            $currentPage.html(bannerApplyPageIndex + 1);
            $obj.removeClass('disabled');
            let data = {
                status: 0,
                page: bannerApplyPageIndex + 1
            }
            handleData.initBannerApply(url, $tbody, data, status, $allPage);
        }
    },
    // 上一页
    handleBannerCantainPrePage($obj, $tbody, $currentPage, url, status, $allPage) {
        $obj.siblings('li').removeClass('disabled');
        if (bannerApplyPageIndex <= 0) {
            bannerApplyPageIndex = 0;
            $obj.addClass('disabled');
        } else {
            bannerApplyPageIndex--;
            $currentPage.html(bannerApplyPageIndex + 1);
            $obj.removeClass('disabled');
            let data = {
                status: 0,
                page: bannerApplyPageIndex + 1
            }
            handleData.initBannerApply(url, $tbody, data, status, $allPage);
        }
    },
};
export {handleData};
export {allUrl};
export {springNum};