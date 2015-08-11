that.$element.append(templates.propertiesWindow);

that.$element.on("showPropertiesWindow", function(event, obj) {
    var $this = $(this);
    var $propertiesWindow = $this.find(".cb-propertiesWindow");
    $propertiesWindow.show();
});