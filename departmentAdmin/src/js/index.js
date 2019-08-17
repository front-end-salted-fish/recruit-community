// import {$} from "../../lib/jquery-1.12.4";
// console.log($)
import '../../lib/bootstrap-3.3.7/dist/css/bootstrap.min.css';
import {
  isDate,
  log
} from 'util';
import {
  get
} from 'http';
// 侧边栏
let asideThat;
class aside {
  constructor() {
    asideThat = this;
    //左侧栏整体
    this.$btns = $("#aside-nav");
    // 部门管理按钮
    this.$accountBtn = $("#aside-nav .account-btn");
    // 管理部门的字体图标
    this.$accountBtnIcon = $("#aside-nav .account-btn i")
    // 部门管理下拉菜单
    this.$accountMenu = $("#aside-nav .account-menu");
    this.init();
  }
  init() {
    this.$btns.on("click", function (e) {
      e = e || window.event;
      let target = e.target;
      // console.log(target.className);
      if (target.tagName == "DIV") {
        console.log("我是div")
        asideThat.changeClass(target, "aside-btn-current");
      } else if (target.tagName == "I" && $(target).parent()[0].tagName == "DIV" || target.tagName == "SPAN" && $(target).parent()[0].tagName == "DIV") {
        asideThat.changeClass($(target).parent(), "aside-btn-current");
      }
    });
    // 给下拉菜单注册事件
    this.$accountBtn.on("click", function () {
      $(this).toggleClass("current-bgc");
      asideThat.$accountBtnIcon.toggleClass("icon-ico_open");
      asideThat.$accountMenu.slideToggle(200);
      //移除兄弟的样式
      asideThat.$accountMenu.parent().siblings().slice(1).find("i").removeClass("icon-ico_open");
      asideThat.$accountMenu.parent().siblings().slice(1).find("div").removeClass("current-bgc");
      asideThat.$accountMenu.parent().siblings().slice(1).find("ul").slideUp(200);
    })
  }
  // 修改类名
  changeClass(target, classname) {
    $(target).toggleClass(classname);
    $(target).siblings().removeClass(classname);
  }
}
// 账号管理功能
let loginThat;
class login {
  constructor() {
    loginThat = this;
    // 获取登录按钮
    this.$loginbtn = $(".login-icon");
    //获取隐藏菜单
    this.$menu = $(".account-menu");
    // 修改密码按钮
    this.$changeBtn = $(".account-menu .edit-password");
    //获取密码页
    this.$passwordPage = $("#change-password");
    //获取主页
    this.$mainBox = $("#main-box");
    // 取消修改按钮
    this.$quitBtn = $("#change-password .quit");
    //确认修改
    this.$affirm = $("#change-password .affirm");
    // 获取旧密码输入框
    this.$oldInput = $("#change-password #old-password");
    // 获取新密码
    this.$newInput = $("#change-password #new-password");
    // 获取再次输入的密码
    this.$reNewInput = $("#change-password #renew-password");
    //密码错误提示
    this.$tips = $("#change-password .tips");
    // 操作提示框
    this.$operaTip = $("#opera-tip");
    this.init();
  }
  init() {

    //给修改密码按钮注册事件
    this.$changeBtn.on("click", function () {
      loginThat.$mainBox.hide();
      loginThat.$passwordPage.show();
    });
    //给取消按钮注册事件
    this.$quitBtn.on("click", function () {
      loginThat.$mainBox.show();
      loginThat.$passwordPage.hide();
    });
    //给输入框注册聚焦事件
    this.$oldInput.on("click", function () {
      loginThat.$tips.removeClass("view-tips");
    });
    this.$newInput.on("click", function () {
      loginThat.$tips.removeClass("view-tips");
    })
    //给确认修改密码按钮注册事件
    this.$affirm.on("click", function () {
      //获取新旧密码
      let oldPasswrod = loginThat.$oldInput[0].value;
      let newPassword = loginThat.$newInput[0].value;
      let reNewPassword = loginThat.$reNewInput[0].value;
      if (oldPasswrod == newPassword) {
        loginThat.$tips[0].innerText = "新旧密码不能一致";
        loginThat.$tips.addClass("view-tips");
        return false;
      }
      if (newPassword != reNewPassword) {
        loginThat.$tips[0].innerText = "两次输入新密码不一致";
        loginThat.$tips.addClass("view-tips");
        return false;
      }
      if (oldPasswrod != "" && newPassword != "") {
        //发送请求校验密码
        pageThat.getData({
          url: pageThat.$changePassword,
          type: "post",
          data: JSON.stringify({
            adminId: pageThat.$adminId,
            oldPassword: oldPasswrod,
            password: newPassword
          })
        }).then((res) => {
          //显示提示信息
          console.log(res.msg);
          if (res.msg == "一切正常") {
            loginThat.$oldInput[0].value = "";
            loginThat.$newInput[0].value = "";
            //显示动画
            loginThat.$operaTip[0].innerText = "操作成功";
            loginThat.$operaTip.addClass("opera-tip-view");
            setTimeout(() => {
              loginThat.$successfulTip.removeClass("opera-tip-view");
            }, 800);
            loginThat.$quitBtn.click();
          }
        })
      }
    })
  }
  changePassword(oldPassword, newPassword) {
    pageThat.getData({
      url: pageThat.$changePassword,
      data: {
        adminId: pageThat.$adminId,
        oldPassword: oldPassword,
        password: newPassword
      }
    })
  }
}

// 部门信息
let introductionThat;
class introduction {
  constructor() {
    introductionThat = this;
    // 获取详情页按钮
    this.$introductionBtn = $(".brief-introduction");
    // 获取详情页
    this.$detialPage = $("#brief-introduction-box");
    // 获取详情页内容
    this.$detialContent = $("#brief-introduction-box .content-box");
    // 获取修改按钮
    this.$editBtn = $("#brief-introduction-box button");
    // 获取关闭按钮
    this.$close = $("#brief-introduction-box .close");
    // 获取拖拽区域
    this.$drapArea = $("#brief-introduction-box .drap-area");
    //获取提示信息
    this.$tips = $("#brief-introduction-box .tips");
    // 获取社团
    this.$communityName = $("#comunity-name");
    // 获取部门名
    this.$departmentName = $("#department-name");
    // 存储获取到的部门简介内容
    this.$getContent = {};
    // 调用初始化函数
    this.init();
  }
  init() {

    // 给详情页按钮注册点击事件
    this.$introductionBtn.on("click", function () {
      console.log("详情页按钮被点了");
      introductionThat.$detialPage.fadeToggle(300);
    });

    //给详情页的关闭按钮注册事件
    this.$close.on("click", function () {
      introductionThat.$detialPage.fadeOut(300);
    });

    //给修改按钮注册事件
    this.$editBtn.on("click", function () {
      introductionThat.$detialContent = $("#brief-introduction-box .content-box");
      if ($(this).text() == "修改") {
        introductionThat.edit(introductionThat.$detialContent);
      } else if ($(this).text() == "完成") {
        // 获取简介内容
        let intro = introductionThat.$detialContent.text();
        introductionThat.finishEdit(introductionThat.$detialContent, intro);
      }
    });

    // 给拖拽区域注册事件
    this.$drapArea.on("mousedown", function (event) {
      let ox = event.clientX - introductionThat.$detialPage[0].offsetLeft;
      let oy = event.clientY - introductionThat.$detialPage[0].offsetTop;
      console.log(ox, oy);
      $(document).on("mousemove", function (e) {
        let x = e.pageX;
        let y = e.pageY;
        console.log(x, y);
        introductionThat.$detialPage[0].style.left = x - ox + "px";
        introductionThat.$detialPage[0].style.top = y - oy + "px";
      })
    })

    // 给document注册事件解绑
    $(document).on("mouseup", function () {

      $(document).unbind("mousemove");
    })
    // 给输入框注册键盘按下事件
    this.$detialContent.on("input", function (e) {
      //调用限制字数的函数
      introductionThat.limitInput($(this),150,function(){
        introductionThat.$tips.addClass("tips-anim");
        obj.addClass("modification-limit");
      },function() {
        introductionThat.$tips.removeClass("tips-anim");
        obj.removeClass("modification-limit");
      })
    })
  }
  //编辑功能
  edit(obj) {

    obj[0].setAttribute("contenteditable", "true");
    obj[0].focus();
    obj.on("keydown", function (event) {
      if (event.keyCode == "13") {
        this.blur();
        introductionThat.$editBtn[0].innerText = "编辑";
        obj[0].setAttribute("contenteditable", "false");
        //移除高亮提示
        introductionThat.$tips.removeClass("tips-anim");
        $(this).removeClass("modification-limit");
      }
    })
    introductionThat.$editBtn[0].innerText = "完成";
  }
  //完成编辑
  finishEdit(obj, intro, name) {
    let text = obj[0].innerText;
    obj[0].setAttribute("contenteditable", "false");
    obj[0].innerText = text;
    introductionThat.$editBtn[0].innerText = "修改";

    // 发起请求修改数据
    newPage.getData({
      type: "post",
      url: pageThat.$changeIntro,
      data: JSON.stringify({
        departmentId: newPage.$departmentId,
        introduce: intro
      })
    })
  }
  //拖拽功能
  drap(obj) {
    let ofs = obj.offset();
    console.log(ofs);
  }
  //解析部门数据
  analysis() {
    console.log(introductionThat.$getContent);
    let obj = introductionThat.$getContent;
    //更新部门名
    introductionThat.$departmentName[0].innerText = obj.object.name;
    //更新部门简介
    introductionThat.$detialContent[0].innerText = obj.object.introduce;
  }
  // 限制输入字符
  limitInput(obj,max,overFunc,notoverFunc) {
    if (obj.text().length > max) {
      //超过150字时阻止输入
      obj.text(obj.text().substring(0, 150));
      let range = window.getSelection(); //创建range
      range.selectAllChildren(obj[0]); //range 选择obj下所有子内容
      range.collapseToEnd(); //光标移至最后
      overFunc();
    } else {
      notoverFunc();
    }
  }
}

//学生列表模块
let studentListThat;
class studentList {
  constructor() {
    studentListThat = this;
    // 获取tbody
    this.$table = $(".table .table-body");
    //获取加载动画
    // this.$loadingAnimate = $(".login-animate")
    // 获取分页按钮组
    this.$pageingBtns = $(".paging");
    // 获取发起新一轮考核按钮
    this.$newStep = $("#table-box .new-step");
    // 获取搜索框
    this.$search = $("#table-box .search .search-input");
    // 获取搜索按钮
    this.$searchBtn = $("#table-box .search #glass");
    //取消搜索按钮
    this.$quitSearch = $("#table-box .quit-search");
    // 获取tr
    this.$allTr = $(".table .table-body tr");
    // 获取编辑按钮
    this.$editBtn = $("#table-box tbody tr button.edit");
    // 获取删除按钮
    this.$delete = $("#table-box tbody tr button.delete");
    // 获取添加按钮
    this.$add = $("#table-box tbody tr button.add");

    // 获取阶段按钮
    this.$stageUl = $("#table-box .search .classify");
    // 获取最新的阶段
    this.$newStage = 0;

    // 记录选中的阶段
    this.$curStage = 0;
    // 记录当前搜索的名字
    this.$searchName = "";
    // 记录是否搜索
    this.$isSearch = false;
    // 记录是否在发起请求
    this.$isAddStage = false;
    this.init();
  }
  init() {

    this.updata();

    //给发起新一轮按钮注册事件
    this.$newStep.on("click", function () {
      if(newStudentList.$newStage >= 6) {
          //显示动画
          newLogin.$operaTip[0].innerText = "最多发起六轮";
          newLogin.$operaTip.addClass("opera-tip-view");
          setTimeout(() => {
            newLogin.$operaTip.removeClass("opera-tip-view");
          }, 800);
        return false;
      }
      $(this).prop("disabled", "disabled");
      //发起新一轮自动跳到最新状态
      let func = function () {
        newPrimary.$addNav.show(250);
        newAside.$btns.hide(250);
        studentListThat.$delete.hide(100);
        studentListThat.$editBtn.hide(100);
        studentListThat.$add.show(100);
      }
      studentListThat.toNewStatus(func);
      //更改是否
      studentListThat.$isAddStage = true;
      // 解绑其他阶段按钮的事件
      studentListThat.$stageUl.unbind("click");
      // 更新阶段按钮
      studentListThat.creStatusBtn(newStudentList.$newStage);
    })

    //给搜索框注册事件
    this.$search.on("keydown", function (event) {
      if (event.keyCode == 13) {
        event.currentTarget.blur();
        // 将当前页恢复到1
        pagingThat.$currentBtn = 1;
      }
    }).on("focus", function () {
      studentListThat.$quitSearch.show(0);
      studentListThat.$newStep.hide(200);
      //改变是否搜索的状态
      studentListThat.$isSearch = true;
    }).on("blur", function () {
      if (this.value.trim() == "") {
        return false;
      }
      // 搜索的字段
      let str = this.value.trim();
      studentListThat.$searchName = str;
      console.log(str);
      // 显示搜索结果
      newStudentList.updateTable(pageThat.$getList, pageThat.$getStudAmount, str, null);
      // 改变是否搜索
      studentListThat.$isSearch = true;
    });

    //取消搜索
    this.$quitSearch.on("click", function () {
      console.log("取消搜索");
      studentListThat.$newStep.show(200);
      studentListThat.$quitSearch.fadeOut(300);
      // 将当前搜索的人员名字置空
      studentListThat.$searchName = "";
      // 更新表格数据及分页按钮
      studentListThat.updateTable(pageThat.$getList, pageThat.$getStudAmount, null, null);
      // 改变是否搜索
      studentListThat.$isSearch = false;
      // 清空输入框内容
      studentListThat.$search.get(0).value = "";
    })

    //给搜索按钮注册事件
    this.$searchBtn.on("click", function () {
      studentListThat.$search.blur();
      event.target.value = "";
    })

    // 给阶段按钮注册事件
    this.$stageUl.on("click", "li", function (event) {
      studentListThat.stageBtnClick(event);
    })

    // 给table委托按钮事件
    this.$table.on("click", "tr td button", function (event) {
      console.log($(event.currentTarget).index());

      //编辑按钮
      if ($(event.currentTarget).index() == 0) {
        console.log(this);
        if (this.innerText == "编辑") {
          let lastFocus = $(".tr-focus");
          // 移除上一个元素的类名
          lastFocus.removeClass("tr-focus");
          lastFocus.children().last().children(".edit").text("编辑");
          lastFocus.children().prop({
            contenteditable: false
          })
          this.innerText = "完成";
          studentListThat.edit($(this.parentNode), true);
          $(this.parentNode.parentNode).addClass("tr-focus");

        } else {
          this.innerText = "编辑";
          let parent = $(this.parentNode);
          studentListThat.finishEdit($(this.parentNode));
          $(this.parentNode.parentNode).removeClass("tr-focus") //移除行聚焦的类名;

          function getStuIformation(num) {
            return parent.siblings().slice(num, num + 1).text();
          }
          // tr的数据生成
          let newStuData = {
            studentNumber: getStuIformation(1),
            name: getStuIformation(2),
            sex: getStuIformation(3),
            phone: getStuIformation(4),
            academy: getStuIformation(5),
            majorClass: getStuIformation(6),
            dormitory: getStuIformation(7),
            id: Math.sqrt(parent.parent().attr("data-id") - 3)
          };
          console.log(newStuData);
          //发送请求
          newPage.getData({
            url: newPage.$changeStuMsg,
            type: "post",
            data: JSON.stringify(newStuData)
          })
        }
      }
      //删除按钮
      if ($(event.currentTarget).index() == 1) {
        let isDate = window.confirm("确定要删除吗");
        if (isDate) {
          let targetNode = $(this.parentNode.parentNode);
          let stuid = Number(targetNode.attr("data-id"));
          // 获取当前页剩余节点数
          console.log(stuid + "hahhah");
          targetNode.remove();
          let leaveNum = studentListThat.$table.children().length;
          if (leaveNum == 0) {
            $(".paging .last-page").click();
          }
          // 发起删除的请求
          pageThat.getData({
            url: pageThat.$deleteStu,
            type: "post",
            data: JSON.stringify(
              Math.sqrt(stuid - 3)
            )
          }).then((res) => {
            //发起请求重新渲染列表
            return pageThat.getData({
              url: newPage.$getList,
              data: {
                communityId: pageThat.$communityId,
                departmentId: pageThat.$departmentId,
                status: newStudentList.$curStage,
                pageCode: newpaging.$currentBtn
              }
            })
          }).then((res1) => {
            newStudentList.creatEle(res1, studentListThat.$table);
          });
        } else {
          return false;
        }
      }
      //添加按钮
      if ($(event.currentTarget).index() == 2) {
        let num = $(this).parent().siblings()[0].innerText;
        let studentId = $(this).parent().siblings()[1].innerText;
        let name = $(this).parent().siblings()[2].innerText
        let id = $(this).parent().parent().attr("data-id");
        console.log(Math.sqrt(id - 3));
        // 发起请求改变状态
        pageThat.getData({
          url: pageThat.$changeStuStatus,
          type: "post",
          data: JSON.stringify({
            studentIds: [Math.sqrt(id - 3)],
            exercisable: 0
          })
        })
        // 预添加
        let newTr = `<td>${studentId}</td><td>${name}</td><td class="text-center"><i class="iconfont icon-guanbi"></i></td>`;
        let tr = document.createElement("tr");
        tr.innerHTML = newTr;
        tr.setAttribute("data-id", id);
        tr.setAttribute("data-index", num);
        newPrimary.$addTbody.append($(tr));
        $(this).addClass("forbid").attr("disabled", "disabled");
      }
    });
  }
  updata() {

    studentListThat.$table = $(".table .table-body");
    // 获取tr
    studentListThat.$allTr = $(".table .table-body tr");
    // 获取编辑按钮
    studentListThat.$editBtn = $("#table-box tbody tr button.edit");
    // 获取删除按钮
    studentListThat.$delete = $("#table-box tbody tr button.delete");
    // 获取添加按钮
    studentListThat.$add = $("#table-box tbody tr button.add");
  }
  // 跳到最新阶段
  toNewStatus(func) {
    //发起新一轮时跳到最新阶段
    studentListThat.$stageUl.children().last().click().addClass("current-stage");
    studentListThat.$stageUl.children().last().click().siblings().removeClass("current-stage");
    //更新当前选中的阶段按钮状态
    studentListThat.$curStage = studentListThat.$stageUl.children().last().index() - 1;
    console.log(studentListThat.$curStage);
    // 显示对应阶段的数据
    studentListThat.updateTable(pageThat.$getList, pageThat.$getStudAmount, null, func);
  }
  // 更新表格及分页数据
  updateTable(tableurl, pageurl, name, func) {
    let data = {
      communityId: pageThat.$communityId,
      departmentId: pageThat.$departmentId,
      pageCode: 1,
      status: studentListThat.$curStage,
      name: name || null
    }
    if (!name) {
      delete data.name
    }
    //重新获取当前阶段的数据
    newPage.getData({
      url: tableurl,
      data: data
    }).then((res) => {
      console.log(res);
      //更新表格数据
      newStudentList.creatEle(res, studentListThat.$table);
      //更新分页按钮
      let data = {
        communityId: pageThat.$communityId,
        departmentId: pageThat.$departmentId,
        status: studentListThat.$curStage,
        name: studentListThat.$searchName
      };
      if (studentListThat.$searchName == "") {
        delete data.name
      }
      return newPage.getData({
        url: pageurl,
        data: data
      })
    }).then((res) => {
      console.log(res.object.studentCount);
      //重置按钮
      if (func) {
        console.log(func);
        func();
      }
      //判断总页数
      let totalPage = Math.ceil(res.object.studentCount / 12);
      newpaging.$pageTotal = totalPage;
      newpaging.creatLis(studentListThat.$curStage, newpaging.$pageTotal);
      pagingThat.lineHeight($(".paging ul li"), 1);
    })
  }
  // 动态生成表格
  creatEle(msg, table) {
    console.log("生成表格");
    table.empty();
    let data = msg.object;
    for (let i = 0; i < data.length; i++) {
      let id = data[i].id;
      let ele = document.createElement("tr");
      let isAdd = data[i].exercisable;
      let eleInner =
        `
        <td>${i + 1 + (newpaging.$currentBtn - 1) * 12}</td>
        <td>${data[i].studentNumber}</td>            
        <td>${data[i].name}</td>  
        <td>${data[i].sex}</td>  
        <td>${data[i].phone}</td>  
        <td>${data[i].academy}</td>  
        <td>${data[i].majorClass}</td>  
        <td>${data[i].dormitory}</td>
        <td><button class="edit btn btn-primary">编辑</button><button class="delete btn btn-warning">删除  
      `;
      // 判断是否是添加状态
      if (!isAdd) {
        console.log(data[i]);
        eleInner += `<button class="add btn btn-info forbid" disabled="disabled">添加</button></td>`;
      } else {
        eleInner += `<button class="add btn btn-info">添加</button></td>`
      }
      // id加密
      ele.setAttribute("data-id", (id * id + 3));
      ele.innerHTML = eleInner;
      table.append($(ele));
    }
    studentListThat.updata();
    if (studentListThat.$isAddStage) {
      studentListThat.$delete.hide(0);
      studentListThat.$editBtn.hide(0);
      studentListThat.$add.show(0);
    }
  }
  // 给元素添加编辑
  edit(obj, status) {
    obj.siblings().slice(1).prop({
      contenteditable: status
    })
    obj.siblings()[1].focus();
    obj.siblings().on("input", function (event) {
      let str = event.target.innerText;
      console.log(str)
      if ((event.keyCode == 13 || event.keyCode == 9) && str != "") {
        this.blur();
      } else if ((event.keyCode == 13 || event.keyCode == 9) && str == "") {
        // event.preventDefault();
        this.focus();
      }
    })
  }
  //撤销可编辑
  finishEdit(obj) {
    console.log("完成修改了")
    obj.siblings().slice(1).prop({
      contenteditable: "false"
    });
  }
  //动态生成状态按钮
  creStatusBtn(num) {
    studentListThat.$stageUl[0].innerHTML = "";
    studentListThat.$stageUl[0].innerHTML = `<li>阶段分类:</li>`;
    for (let i = 0; i <= num; i++) {
      let li = document.createElement("li");
      li.innerText = studentListThat.switchStatus(i);
      if (i == num) {
        li.className = "current-stage";
      }
      studentListThat.$stageUl.append(li);
    }
  }
  //阶段匹配
  switchStatus(num) {
    switch (num) {
      case 0:
        return "已报名";
      case 1:
        return "第一轮";
      case 2:
        return "第二轮";
      case 3:
        return "第三轮";
      case 4:
        return "第四轮";
      case 5:
        return "第五轮";
      case 6:
        return "第六轮";
      case 7:
        return "第七轮";
      case 8:
        return "第八轮";
      case 8:
        return "第九轮";
      case 8:
        return "第十轮";
    }
  }
  // 渲染元素到预添加列表
  addToPrimary(data) {
    let obj = data.object;
    // 添加到预添加
    for (let i = 0; i < obj.length; i++) {
      let newTr = `<td>${obj[i].studentNumber}</td><td>${obj[i].name}</td><td class="text-center"><i class="iconfont icon-guanbi"></i></td>`;
      let tr = document.createElement("tr");
      tr.innerHTML = newTr;
      tr.setAttribute("data-id", (obj[i].id * obj[i].id + 3));
      // tr.setAttribute("data-index", i + 1 + (newpaging.$currentBtn - 1) * 12);
      newPrimary.$addTbody.append($(tr));
    }
  }
  // 阶段按钮的点击事件
  stageBtnClick(event) {

    if ($(event.currentTarget).index() == 0) {
      return false;
    } else {
      $(event.currentTarget).addClass("current-stage");
      $(event.currentTarget).siblings().removeClass("current-stage");
      //更新当前选中的阶段按钮状态
      studentListThat.$curStage = $(event.currentTarget).index() - 1;
      pagingThat.$currentBtn = 1;
      // 显示对应阶段的数据
      studentListThat.updateTable(pageThat.$getList, pageThat.$getStudAmount, studentListThat.$searchName);
    }
  }
}

let pagingThat;
class Paging {
  constructor() {
    pagingThat = this;
    //获取分页按钮ul
    this.$pageUl = $(".paging ul");
    //获取分页按钮的li
    this.$lis = $(".paging ul li");
    //获取上一页按钮
    this.$lastPage = $(".paging .last-page");
    // 获取下一页按钮
    this.$nextPage = $(".paging .next-page");
    // 当前高亮的按钮
    this.$currentBtn = 1;
    //获取页码总数
    this.$pageTotal = 0;
  }
  init() {
    this.creatLis(1, this.$pageTotal);

    // 更新小lis
    this.update();
    this.lineHeight($(".paging ul li"), 1);
    // ul委托事件
    this.$pageUl.on("click", "li", function (event) {

      let num = event.target.innerText;
      if (event.target.innerText == "···") {
        return false;
      } else if (num != pagingThat.$currentBtn) {
        console.log(num, pagingThat.$currentBtn);
        pagingThat.$currentBtn = Number(event.target.innerText);
        pagingThat.creatLis(pagingThat.$currentBtn, pagingThat.$pageTotal);
        pagingThat.lineHeight($(".paging ul li"), num);
        //获取新的一页的信息
        newPage.getData({
          url: pageThat.$getList,
          data: {
            communityId: pageThat.$communityId,
            departmentId: pageThat.$departmentId,
            status: studentListThat.$curStage,
            pageCode: num
          }
        }).then(function (res) {

          newStudentList.creatEle(res, newStudentList.$table);
        })
      }
    }).on("click", ".last-page", function () {
      console.log("上一页");
      pagingThat.changePage(0, -1);
    }).on("click", ".next-page", function () {
      console.log("下一页");
      pagingThat.changePage(pagingThat.$pageTotal + 1, 1);
    })
  }
  //更新元素
  update() {
    pagingThat.$lis = $(".paging ul li");
    pageThat.$lastPage = $(".paging .last-page");
    pageThat.$nextPage = $(".paging .next-page");
    console.log(pageThat.$lastPage);
    console.log(pagingThat.$lis);
  }
  //动态生成lis
  creatLis(cur = 0, total) {

    console.log(total);
    pagingThat.$pageUl.empty()
    let ulInner = `<span class="fl col-xs-1 col-sm-1 col-md-1 col-lg-1"><i class="iconfont icon-shangyiye last-page"></i></span>`;
    if (total > 7) {
      if (cur < 5) {
        ulInner += `
                  <li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>···</li><li>${total}</li>
                  
                  `;
      }
      if (cur >= 5) {
        ulInner += `
                    <li>1</li><li>···</li><li>${cur-1}</li><li>${cur}</li><li>${cur+1}</li><li>···</li><li>${total}</li>
                    `;
      }
      if (cur >= total - 2) {
        ulInner += `
                    <li>1</li><li>···</li><li>${total-4}</li><li>${total-3}</li><li>${total-2}</li><li>${total-1}</li><li>${total}</li>
                  `;
      }
    } else {
      for (let i = 0; i < total; i++) {
        ulInner += `<li>${i+1}</li>`
      }
    }
    ulInner += `<span class="fl col-xs-1 col-sm-1 col-md-1 col-lg-1"><i class="iconfont icon-xiayiye next-page"></i></span>`
    pagingThat.$pageUl[0].innerHTML = ulInner;
    pagingThat.update();
  }
  //上下页切换
  changePage(limit, way) {
    pagingThat.update();

    pagingThat.$currentBtn = Number(pagingThat.$pageUl.children(".currentPage").text()) + way;
    if (pagingThat.$currentBtn == limit) {
      return false;
    } else {
      pagingThat.creatLis(pagingThat.$currentBtn, pagingThat.$pageTotal);
      pagingThat.lineHeight($(".paging ul li"), pagingThat.$currentBtn);
      let data = {
        communityId: pageThat.$communityId,
        departmentId: pageThat.$departmentId,
        status: newStudentList.$curStage,
        pageCode: pagingThat.$currentBtn
      }
      if (newStudentList.$searchName != "") {
        data.name = newStudentList.$searchName;
      }
      //发送请求获取对应页的内容
      newPage.getData({
        url: pageThat.$getList,
        data: data
      }).then(function (res) {
        newStudentList.creatEle(res, studentListThat.$table);
        // newStudentList.$loadingAnimate.hide(0);
      })
    }
  }
  //按钮高亮
  lineHeight(arr, target) {

    arr.each(function (i) {
      if (arr.eq(i).text() == target) {
        console.log(i + "高亮")
        arr.eq(i).addClass("currentPage");
      }
    })
  }
}
// 预选栏
let primaryThat;
class Primary {
  constructor() {
    primaryThat = this;

    this.$addNav = $("#add-nav");
    this.$addTbody = $("#add-nav table tbody");
    this.$allTr = $("#add-nav table tbody tr");
    //确认按钮
    this.$affirmBtn = $("#add-nav .affirm");
    //取消按钮
    this.$quitBtn = $("#add-nav .quit");

    this.init();
  }
  init() {

    // 给取消按钮注册事件
    this.$quitBtn.on("click", function () {
      primaryThat.$addNav.hide(250);
      newAside.$btns.show(250);
      //恢复按钮
      newStudentList.$delete.show(0);
      newStudentList.$editBtn.show(0);
      newStudentList.$add.hide(0);
      newStudentList.$newStep.prop("disabled", "");
      // 是否发起新一轮状态变为false
      newStudentList.$isAddStage = false;
      // 重新绑定其他的按钮的事件
      newStudentList.$stageUl.on("click", "li", function (event) {
        newStudentList.stageBtnClick(event);
      })
    })

    // 给确定按钮注册事件
    this.$affirmBtn.on("click", function () {
      primaryThat.updata()
      primaryThat.$addNav.hide(250);
      newAside.$btns.show(250);
      //恢复按钮
      newStudentList.$delete.show(100);
      newStudentList.$editBtn.show(100);
      newStudentList.$add.hide(100);
      newStudentList.$newStep.prop("disabled", "");
      //显示动画
      loginThat.$successfulTip.addClass("successful-view");
      setTimeout(() => {
        loginThat.$successfulTip.removeClass("successful-view");
      }, 700);
      // 发起请求改变状态
      primaryThat.updata();
      let stuArr = [];
      primaryThat.$allTr.each(function (i, value) {
        console.log($(value).attr("data-id"));
        stuArr.push(Math.sqrt($(value).attr("data-id") - 3));
      })
      console.log(stuArr);
      // 改变最大状态
      newStudentList.$newStage++;
      newStudentList.$curStage++;
      newStudentList.$isAddStage = false;
      pageThat.getData({
        type: "post",
        url: pageThat.$changeStuStatus,
        data: JSON.stringify({
          studentIds: stuArr,
          exercisable: 1,
          status: newStudentList.$newStage
        })
      }).then(() => {
        studentListThat.updateTable(pageThat.$getList, pageThat.$getStudAmount, studentListThat.$searchName);
        newStudentList.creStatusBtn(newStudentList.$newStage);
      })
      loginThat.$quitBtn.click();
      //清空预选栏中数据
      primaryThat.$addTbody.empty();
      //恢复阶段按钮的点击事件
      studentListThat.$stageUl.on("click", "li", function (event) {
        studentListThat.stageBtnClick(event);
      })
    })
    //给tbody委托事件
    this.$addTbody.on("click", "i", function () {
      $(this).parent().parent().remove();
      let id = $(this).parent().parent().attr("data-id");
      newStudentList.$allTr = $(".table .table-body tr");
      // 遍历解除添加按钮的禁用
      newStudentList.$allTr.each(function (i, value) {

        if ($(value).attr("data-id") == id) {
          console.log(value);
          $(value).find(".add").removeClass("forbid").prop("disabled", "");
        };
      })
      // 发起请求还原add按钮
      newPage.getData({
        type: "post",
        url: newPage.$changeStuStatus,
        data: JSON.stringify({
          studentIds: [Math.sqrt(id - 3)],
          exercisable: 1
        })
      })
    })
  }
  updata() {
    primaryThat.$allTr = $("#add-nav table tbody tr");
  }
}
let pageThat;
//页面数据初始化页面
class Page {
  constructor() {
    pageThat = this;

    //记录最新阶段
    this.$stage = 0;
    //记录账号信息
    this.$communityId = 21;
    this.$departmentId = 31;
    this.$adminId = 23;
    // 公共ip
    this.$commonality = "http://10.21.23.177:8080"
    // 获取部门账号信息
    this.$getAccount = this.$commonality + "/admin/getDepartment"
    // 获取学生信息列表(搜索，获取某阶段的学生，分页)
    this.$getList = this.$commonality + "/admin/getApplyUsersList";
    // 获取最新状态
    this.$getNewStatus = this.$commonality + "/admin/getMaxStatus";
    // 获取某阶段学生数量
    this.$getStudAmount = this.$commonality + "/admin/getStudentCount";
    // 获取已添加进预选的学生
    this.$getAddToPrimary = this.$commonality + "/admin/getNotExercisableStudents";
    // 修改密码
    this.$changePassword = this.$commonality + "/admin/updateAdminPassword";
    // 修改学生信息
    this.$changeStuMsg = this.$commonality + "/admin/updateStudent";
    // 改变学生状态
    this.$changeStuStatus = this.$commonality + "/admin/updateStudentStatusExercisable";
    // 修改部门简介
    this.$changeIntro = this.$commonality + "/admin/updateDepartmentInformation";
    // 删除学生
    this.$deleteStu = this.$commonality + "/admin/deleteStudent";

    this.init();
  }
  init() {
    //最新的数据
    // 获取部门id
    this.getData({
      url: pageThat.$getNewStatus,
      data: {
        communityId: pageThat.$communityId,
        departmentId: pageThat.$departmentId
      }
    }).then((res) => {
      console.log(res);
      // 更新table中的阶段信息
      newStudentList.$newStage = res.object.maxStatus;
      newStudentList.$curStage = res.object.maxStatus;
      console.log(newStudentList.$newStage);
      newStudentList.creStatusBtn(newStudentList.$newStage);
      return pageThat.getData({
        url: pageThat.$getList,
        data: {
          communityId: pageThat.$communityId,
          departmentId: pageThat.$departmentId,
          pageCode: 1,
          status: newStudentList.$newStage
        }

      }, true);
    }).then((res1) => {
      console.log(res1);
      // 更新table 中的数据
      newStudentList.creatEle(res1, studentListThat.$table);
      // newStudentList.$loadingAnimate.hide(0);
      return pageThat.getData({
        url: pageThat.$getStudAmount,
        data: {
          communityId: pageThat.$communityId,
          departmentId: pageThat.$departmentId,
          status: newStudentList.$newStage
        }

      })
    }).then((res2) => {
      console.log(res2.object.studentCount);
      // 更新页码
      let maxNum = Math.ceil(res2.object.studentCount / 12);

      newpaging.$pageTotal = maxNum;
      newpaging.init();
    })
    // 获取部门简介
    this.getData({
      url: pageThat.$getAccount,
      data: {
        departmentId: pageThat.$departmentId
      }
    }).then((res) => {
      newIntroduction.$getContent = res;
      newIntroduction.analysis();
    })
    // 获取预添加列表
    this.getData({
      url: pageThat.$getAddToPrimary,
      data: {
        departmentId: pageThat.$departmentId,
        communityId: pageThat.$communityId
      }
    }).then((res) => {
      console.log(res);
      newStudentList.addToPrimary(res);
    })
  }

  //获取数据
  getData(param) {
    return new Promise(function (resovle, reject) {
      $.ajax({
        "type": param.type || "get",
        "async": param.async || true,
        "url": param.url,
        "data": param.data || "",
        "contentType": "application/json",
        "dataType": "json",
        "headers": {
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwZXJtaXNzaW9ucyI6WyJkZXBhcnRtZW50OmluZm86Z2V0IiwidXNlcjphcHBseTp1cGRhdGUiLCJkZXBhcnRtZW50OmluZm86dXBkYXRlIiwidXNlcjphcHBseTpnZXQiLCJ1c2VyOmFwcGx5OmRlbGV0ZSJdLCJyb2xlcyI6WyJEZXBhcnRtZW50QWRtaW4iXSwiYWRtaW5JZCI6MjksImV4cCI6MTU2NjE5OTU5Mn0.BAqPBwAXvQQzIaGynXAcDETDp45QeICprWMJeXRUKZ0"
        },
        "beforeSend": function () {
          $(".loading-animate").show();
        },
        "success": function (res) {
          $(".loading-animate").hide();
          resovle(res);
        },
        "error": function (err) {
          reject(err);
        }
      })
    })
  }
}
//左侧栏实例
let newAside = new aside();
// 登录模块实例
let newLogin = new login();
//部门详情模块
let newIntroduction = new introduction();
// 学生列表模块
let newStudentList = new studentList();
//分页模块
let newpaging = new Paging();
// 右侧栏模块
let newPrimary = new Primary();
// 修改密码模块

// 页面数据加载模块
let newPage = new Page();