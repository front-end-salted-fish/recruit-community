import $ from 'jquery';
const $comfirmFrame = $('.alert ');
const $closeComfirmFrameBtn = $('.alert .close');
const $cancelBtn = $('.alert .cancel');
let comfirmFlag = false;
$closeComfirmFrameBtn.on('click', function() {
    $comfirmFrame.hide();
});
$cancelBtn.on('click', function() {
    $comfirmFrame.hide();
});
export {$comfirmFrame};