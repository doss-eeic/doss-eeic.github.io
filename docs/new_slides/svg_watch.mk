svgs := $(wildcard svg/*.svg)
bases := $(patsubst svg/%.svg,%,$(svgs))

.DEFAULT_GOAL = all

# a rule to generate a single layer from a single base file
define rule_layer
all : svg/L/$(base)_L$(i).svg
svg/L/$(base)_L$(i).svg : svg/L/dir
svg/L/$(base)_L$(i).svg : svg/$(base).svg
	inkscape svg/$(base).svg --export-id=$(id) --export-id-only --export-type=svg --export-filename=svg/L/$(base)_L$(i).svg

endef

# a rule to generate all layers from a single base file
define rule_source
$(foreach i,$(shell seq -w 1 $(shell ./layers.py svg/$(base).svg | wc -l)),$(foreach id,$(shell ./layers.py svg/$(base).svg | awk "NR==$i"),$(call rule_layer)))
endef

# rule to generate all layers from all base files
define rule_all
$(foreach base,$(bases),$(call rule_source))
endef

svg/L/dir :
	mkdir -p $@

$(eval $(call rule_all))



