var templates={propertiesWindow:'<!-- 标题面板 --><div id="cb-title-panel"><div class="pw-header"></div><h3 class="cb-pills-title"></h3><hr class="cb-article-divider"></div><div class="cb-propertiesWindow"><div class="cb-pw-openner" id="pwopenner">&#x5C5E;<br>&#x6027;<br>&#x83DC;<br>&#x5355;<br></div><!-- 图片 --><div class="pw-picture pw-panel" id="pwpicture"><div class="pw-body"><div class="pw-body-content"><form class="form-horizontal"><h6 class="pw-body-content-header">&#x5C5E;&#x6027;</h6><div class="form-group"><label for="cb-picture-height" class="col-sm-2 control-label">height:</label><div class="col-sm-10"><input type="text" class="form-control input-sm" id="cb-picture-height" placeholder="height"></div></div><div class="form-group"><label for="cb-picture-width" class="col-sm-2 control-label">width:</label><div class="col-sm-10"><input type="text" class="form-control input-sm" id="cb-picture-width" placeholder="width"></div></div><h6 class="pw-body-content-header">&#x663E;&#x793A;&#x65F6;&#x95F4;</h6><div class="form-group"><label for="cb-picture-showdate" class="col-sm-2 control-label">&#x5F00;&#x59CB;:</label><div class="col-sm-10"><input type="text" class="form-control input-sm" id="cb-picture-showdate" placeholder="&#x5F00;&#x59CB;"></div></div><div class="form-group"><label for="cb-picture-hidedate" class="col-sm-2 control-label">&#x7ED3;&#x675F;:</label><div class="col-sm-10"><input type="text" class="form-control input-sm" id="cb-picture-hidedate" placeholder="&#x7ED3;&#x675F;"></div></div></form><hr class="cb-article-divider"></div><div class="pw-body-footer"><button type="button" class="btn btn-primary btn-sm save">&#x4FDD; &#x5B58;</button><button type="button" class="btn btn-danger btn-sm delete">&#x5220; &#x9664;</button><button type="button" id="cb-picture-addarea" class="btn btn-primary btn-sm">&#x65B0; &#x5EFA; &#x533A; &#x57DF;</button></div></div></div><!-- 区域 --><div class="pw-area pw-panel" id="pwarea"><div class="pw-body"><div class="pw-body-content"><h6 class="pw-body-content-header">&#x4F4D;&#x7F6E;</h6><form class="form-horizontal"><div class="form-group"><label for="cb-area-width" class="col-sm-2 control-label">width:</label><div class="col-sm-10"><input type="text" class="form-control cb-area-croppos input-sm" id="cb-area-width" data-name="width" maxlength="4" placeholder="width"></div></div><div class="form-group"><label for="cb-area-height" class="col-sm-2 control-label">height:</label><div class="col-sm-10"><input type="text" class="form-control cb-area-croppos input-sm" id="cb-area-height" data-name="height" maxlength="4" placeholder="height"></div></div><div class="form-group"><label for="cb-area-marginleft" class="col-sm-3 control-label">marginleft:</label><div class="col-sm-9"><input type="text" class="form-control cb-area-croppos input-sm" id="cb-area-marginleft" data-name="left" maxlength="4" placeholder="marginleft"></div></div><div class="form-group"><label for="cb-area-margintop" class="col-sm-3 control-label">margintop:</label><div class="col-sm-9"><input type="text" class="form-control cb-area-croppos input-sm" id="cb-area-margintop" data-name="top" maxlength="4" placeholder="margintop"></div></div><hr class="cb-article-divider"><h6 class="pw-body-content-header">&#x7C7B;&#x578B;</h6><div class="pw-body-content-controls"><div id="cb-area-type"><label for="cb-area-type1"><input id="cb-area-type1" data-type="link" type="radio" name="areatype">&#x94FE;&#x63A5;</label><label for="cb-area-type2"><input id="cb-area-type2" data-type="anchor" type="radio" name="areatype">&#x951A;&#x70B9;</label><label for="cb-area-type3"><input id="cb-area-type3" data-type="countdown" type="radio" name="areatype">&#x5012;&#x8BA1;&#x65F6;</label><label for="cb-area-type4"><input id="cb-area-type4" data-type="coupon" type="radio" name="areatype">&#x4F18;&#x60E0;&#x5238;</label></div></div><div class="cb-area-type cb-area-type1 pw-controls-panel"><div class="form-group"><label for="cb-area-url" class="col-sm-3 control-label">&#x94FE;&#x63A5;&#x5730;&#x5740;:</label><div class="col-sm-9"><textarea type="text" class="form-control" rows="3" id="cb-area-url" placeholder="&#x94FE;&#x63A5;&#x5730;&#x5740;"></textarea></div></div><div class="form-group"><label for="cb-area-margintop" class="col-sm-3 control-label">&#x6253;&#x5F00;&#x65B9;&#x5F0F;:</label><div class="col-sm-9"><label for="open-type1" class="radio-inline"><input id="open-type1" data-value="_blank" type="radio" name="opentype" checked="checked">&#x65B0;&#x5EFA;&#x7A97;&#x53E3;</label><label for="open-type2" class="radio-inline"><input id="open-type2" data-value="_self" type="radio" name="opentype">&#x5F53;&#x524D;&#x7A97;&#x53E3;</label></div></div></div><div class="cb-area-type cb-area-type2 pw-controls-panel"><select id="cb-area-anchor" class="form-control input-sm"></select></div><div class="cb-area-type cb-area-type3 pw-controls-panel"><div id="cb-area-fontdemo" class="cb-temp cb-area-fontdemo"></div><div class="form-group"><label for="cb-area-margintop" class="col-sm-3 control-label">&#x5B57;&#x4F53;:</label><div class="col-sm-9"><select id="cb-area-fontfamily" class="form-control input-sm"><option value="&#x5B8B;&#x4F53;">&#x5B8B;&#x4F53;</option><option value="&#x6977;&#x4F53;">&#x6977;&#x4F53;</option><option value="&#x5FAE;&#x8F6F;&#x96C5;&#x9ED1;">&#x5FAE;&#x8F6F;&#x96C5;&#x9ED1;</option></select></div></div><div class="form-group"><label for="cb-area-fontsize" class="col-sm-3 control-label">&#x5B57;&#x4F53;&#x5927;&#x5C0F;:</label><div class="col-sm-9"><select id="cb-area-fontsize" class="form-control input-sm"></select></div></div><div class="form-group"><label for="cb-area-fontcolor" class="col-sm-3 control-label">&#x5B57;&#x4F53;&#x989C;&#x8272;:</label><div class="col-sm-9"><input type="text" class="form-control input-sm" id="cb-area-fontcolor" placeholder="&#x5B57;&#x4F53;&#x989C;&#x8272;"></div></div><div class="form-group"><label for="cb-area-startdate" class="col-sm-3 control-label">&#x5F00;&#x59CB;&#x65F6;&#x95F4;:</label><div class="col-sm-9"><input type="text" class="form-control input-sm" id="cb-area-startdate" placeholder="&#x5F00;&#x59CB;&#x65F6;&#x95F4;"></div></div><div class="form-group"><label for="cb-area-enddate" class="col-sm-3 control-label">&#x7ED3;&#x675F;&#x65F6;&#x95F4;:</label><div class="col-sm-9"><input type="text" class="form-control input-sm" id="cb-area-enddate" placeholder="&#x7ED3;&#x675F;&#x65F6;&#x95F4;"></div></div><div class="form-group"><label for="cb-area-isdayunit" class="col-sm-3 control-label">&#x5929;&#x4E3A;&#x5355;&#x4F4D;:</label><div class="col-sm-9"><div class="checkbox"><label><input type="checkbox" id="cb-area-isdayunit"></label></div></div></div><div class="form-group"><label for="cb-area-enddate" class="col-sm-3 control-label">&#x65F6;&#x95F4;&#x683C;&#x5F0F;:</label><div class="col-sm-9"><select id="cb-area-format" class="form-control input-sm"><option value="cn">&#x65F6;:&#x5206;:&#x79D2;</option><option value="HH:mm:ss">HH:mm:ss</option></select></div></div></div><div class="cb-area-type cb-area-type4 pw-controls-panel"><div class="form-group"><label for="cb-area-url" class="col-sm-3 control-label">&#x4F18;&#x60E0;&#x5238;id</label><div class="col-sm-9"><input type="text" class="form-control input-sm" id="cb-area-couponid" placeholder="&#x4F18;&#x60E0;&#x5238;id,&#x53F7;&#x5206;&#x5272;"></div></div></div></form></div><hr class="cb-article-divider"><div class="pw-body-footer"><div class="pw-body-footer"><button type="button" id="cb-area-save" class="btn btn-primary btn-sm">&#x4FDD; &#x5B58;</button><button type="button" id="cb-area-delete" class="btn btn-danger btn-sm delete">&#x5220; &#x9664;</button></div></div></div></div><!-- 锚点 --><div class="pw-picture pw-panel" id="pwanchor"><div class="pw-body"><div class="pw-body-content"><form class="form-horizontal"><div class="form-group"><label for="cb-anchor-name" class="col-sm-2 control-label">&#x540D;&#x79F0;:</label><div class="col-sm-10"><input type="text" class="form-control input-sm" id="cb-anchor-name" placeholder="&#x540D;&#x79F0;:"></div></div></form></div><hr class="cb-article-divider"><div class="pw-body-footer"><button type="button" id="cb-anchor-save" class="btn btn-primary btn-sm save">&#x4FDD; &#x5B58;</button><button type="button" id="cb-anchor-delete" class="btn btn-danger btn-sm delete deleteevent">&#x5220; &#x9664;</button></div></div></div></div>',bodycontentheader:'<h1 class="pw-body-content-header">#value</h1>',hr:'<hr class="cb-article-divider">'};