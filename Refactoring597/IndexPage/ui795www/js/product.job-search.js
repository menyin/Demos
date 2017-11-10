define(function (require, exports, module) {
    module.exports = jobsearch;
    var $ = jquery = require('jquery');
    function jobsearch() {

        $(function () {
            showSearchFilterCompanys();
            $('.firm-item .firm-right img').click(function () {
                var companyId = $(this).closest('ul').attr('data-cid'),
                    companyName = $(this).closest('ul').find('.firm-md a').html();

                var companys = GetSearch_Companys();
                if (companys == null) {
                    companys = "";
                }
                var arr = companys.split(',');
                if (window.localStorage) {
                    if (arr.length > 30) {
                        alert("最多只能排除30个公司");
                        return;
                    }
                } else {
                    if (arr.length > 10) {
                        alert("此浏览器最多只能排除10个公司");
                        return;
                    }
                }

                var val = companyId + "_" + companyName + ",";
                if (companys.indexOf(val) == -1) {
                    addShowFilterSpan(companyId, companyName);
                    companys += companyId + "_" + companyName + ",";

                    SetSearch_Companys(companys);

                    $('.firm-item:contains("' + companyName + '")').hide();
                    doIfAllHide();
                }
            })
        });


        function showSearchFilterCompanys() {
            $('.firm-filterCompany a.firm-clearAll').click(function () {
                $('.firm-filterCompany').find('span').not('.firm-clearAll').remove();
                SetSearch_Companys('');
                $('.firm-item').show();
            });

            var companys = GetSearch_Companys();

            if (companys == null || companys == '') {
                $('.firm-filterCompany').hide();
                return;
            } else {
                $('.firm-filterCompany').show();
            }
            var arr = companys.split(',');
            for (i = 0; i < arr.length; i++) {
                if (arr[i] != '') {
                    var arr2 = arr[i].split('_');
                    if (arr2.length > 1) {
                        addShowFilterSpan(arr2[0], arr2[1]);
                        $('.firm-item:contains("' + arr2[1] + '")').hide();
                        doIfAllHide();
                    }
                }
            }
        }

        function addShowFilterSpan(companyId, companyName) {
            var $span = $('<span class="filterSpan" data-id="' + companyId + '" title="' + companyName + '">' + startLen(companyName, 8) + '</span>');
            $span.click(function () {
                var companys = GetSearch_Companys();

                if (companys == null) return;
                companys = companys.replace($(this).attr('data-id') + '_' + $(this).attr('title') + ',', '');

                SetSearch_Companys(companys);

                $(this).remove();
                $('.firm-item:contains("' + companyName + '")').show();
            });
            $('.firm-filterCompany').append($span);
            $('.firm-filterCompany').show();
        }


        function getNotInCompanyIds() {
            var notInCompanyIds = "";
            var companys = GetSearch_Companys;
            if (companys == null) return notInCompanyIds;
            var arr = companys.split(',');
            for (var key in arr) {
                if (arr[key] != '') {
                    var arr2 = arr[key].split('_');
                    if (arr2.length > 1) {
                        notInCompanyIds += arr2[0] + ",";
                    }
                }
            }
            return notInCompanyIds;
        }

        function startLen(str, len) {
            if (str.length < len) return str;
            return str.substring(0, len) + "..";
        }

        function doIfAllHide() {
//    if ($('.queryRecruitTable tr:visible').length == 1) {
//        window.location = $('.queryRecruitTable').next().find('a:enabled:contains("下页")').attr("href");
//    }
        }

        function GetSearch_Companys() {
            if (!!window.localStorage) {
                var tmp = window.localStorage.RecruitSearch_Companys;
                if (tmp == null || tmp == '' || tmp == 'null') {
                    tmp = getCookie("cookie_RecruitSearch_Companys");
                    if (tmp != null) {
                        window.localStorage.RecruitSearch_Companys = tmp;
                    }
                }
                return tmp;
            } else {
                return getCookie("cookie_RecruitSearch_Companys");
            }
        }

        function SetSearch_Companys(companys) {
            if (!!window.localStorage) {
                window.localStorage.RecruitSearch_Companys = companys;
            } else {
                setCookie("cookie_RecruitSearch_Companys", companys);
            }
        }

//写Cookie
        function setCookie(name, value) {
            var expire = new Date();
            expire.setFullYear(expire.getFullYear() + 20);
            expire = '; expires=' + expire.toGMTString();
            document.cookie = name + '=' + escape(value) + expire;
        }

// 读取Cookie
        function getCookie(name) {
            var cookieValue = '';
            var search = name + '=';
            if (document.cookie.length > 0) {
                var offset = document.cookie.indexOf(search)
                if (offset != -1) {
                    offset += search.length;
                    var end = document.cookie.indexOf(';', offset);
                    if (end == -1) end = document.cookie.length;
                    cookieValue = unescape(document.cookie.substring(offset, end));
                }
            }
            return cookieValue;
        }

    }
});
