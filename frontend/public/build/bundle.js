
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var divbrowse = (function (exports) {
    'use strict';

    function noop$3() { }
    function assign$1(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run$1(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run$1);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$3;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign$1($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text$1(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text$1(' ');
    }
    function empty$1() {
        return text$1('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush$1);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush$1() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind$m(component, name, callback, value) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            if (value === undefined) {
                callback(component.$$.ctx[index]);
            }
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run$1).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop$3,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush$1();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$3;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop$3;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.54.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* node_modules\svelte-simple-datatables\src\components\SearchInputHTML.svelte generated by Svelte v3.54.0 */

    const file$8 = "node_modules\\svelte-simple-datatables\\src\\components\\SearchInputHTML.svelte";

    function create_fragment$b(ctx) {
    	let input;
    	let input_class_value;
    	let input_placeholder_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", input_class_value = "" + (null_to_empty(/*classList*/ ctx[1]) + " svelte-1mpljnc"));
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", input_placeholder_value = /*$options*/ ctx[2].labels.search);
    			attr_dev(input, "ref", /*ref*/ ctx[0]);
    			toggle_class(input, "css", /*$options*/ ctx[2].css);
    			add_location(input, file$8, 13, 0, 279);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*classList*/ 2 && input_class_value !== (input_class_value = "" + (null_to_empty(/*classList*/ ctx[1]) + " svelte-1mpljnc"))) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty & /*$options*/ 4 && input_placeholder_value !== (input_placeholder_value = /*$options*/ ctx[2].labels.search)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty & /*ref*/ 1) {
    				attr_dev(input, "ref", /*ref*/ ctx[0]);
    			}

    			if (dirty & /*classList, $options*/ 6) {
    				toggle_class(input, "css", /*$options*/ ctx[2].css);
    			}
    		},
    		i: noop$3,
    		o: noop$3,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $options;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchInputHTML', slots, []);
    	let { context } = $$props;
    	let { ref = '' } = $$props;
    	let { classList = '' } = $$props;
    	const options = context.getOptions();
    	validate_store(options, 'options');
    	component_subscribe($$self, options, value => $$invalidate(2, $options = value));

    	const search = value => {
    		context.getPageNumber().set(1);
    		context.getGlobalFilter().set(value);
    		context.getColumns().redraw();
    	};

    	$$self.$$.on_mount.push(function () {
    		if (context === undefined && !('context' in $$props || $$self.$$.bound[$$self.$$.props['context']])) {
    			console.warn("<SearchInputHTML> was created without expected prop 'context'");
    		}
    	});

    	const writable_props = ['context', 'ref', 'classList'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchInputHTML> was created with unknown prop '${key}'`);
    	});

    	const input_handler = e => search(e.target.value);

    	$$self.$$set = $$props => {
    		if ('context' in $$props) $$invalidate(5, context = $$props.context);
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    	};

    	$$self.$capture_state = () => ({
    		context,
    		ref,
    		classList,
    		options,
    		search,
    		$options
    	});

    	$$self.$inject_state = $$props => {
    		if ('context' in $$props) $$invalidate(5, context = $$props.context);
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, classList, $options, options, search, context, input_handler];
    }

    class SearchInputHTML extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { context: 5, ref: 0, classList: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchInputHTML",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get context() {
    		throw new Error("<SearchInputHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set context(value) {
    		throw new Error("<SearchInputHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<SearchInputHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<SearchInputHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<SearchInputHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<SearchInputHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$3) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$3) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$3;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$3;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$3;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const createContext = () => {
        const { subscribe, set, update } = writable({});
        return {
            subscribe, set, update,
            index: () => {
                let $context;
                context.subscribe(store => $context = store);
                return $context
            },
            add: (stores) => {
                const id = stores.getId().get();
                const newContext = { [id]: stores  };
                context.set({ ...context.index(),  ...newContext });
                return newContext[id]
            },
            get: (id) => {
                return context.index()[id] 
            }
        }
    };

    const context = createContext();

    /* node_modules\svelte-simple-datatables\src\SearchInput.svelte generated by Svelte v3.54.0 */

    // (23:0) {#if context}
    function create_if_block$8(ctx) {
    	let searchinputhtml;
    	let current;

    	searchinputhtml = new SearchInputHTML({
    			props: {
    				context: /*context*/ ctx[2],
    				ref: /*ref*/ ctx[0],
    				classList: /*classList*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(searchinputhtml.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchinputhtml, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const searchinputhtml_changes = {};
    			if (dirty & /*context*/ 4) searchinputhtml_changes.context = /*context*/ ctx[2];
    			if (dirty & /*ref*/ 1) searchinputhtml_changes.ref = /*ref*/ ctx[0];
    			if (dirty & /*classList*/ 2) searchinputhtml_changes.classList = /*classList*/ ctx[1];
    			searchinputhtml.$set(searchinputhtml_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchinputhtml.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchinputhtml.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchinputhtml, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(23:0) {#if context}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*context*/ ctx[2] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*context*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*context*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchInput', slots, []);
    	let { ref = '' } = $$props;
    	let { classList = '' } = $$props;
    	let { id = 'svelte-simple-datatable' } = $$props;
    	let context$1 = null;
    	let loop = 0;

    	const interval = setInterval(
    		() => {
    			loop++;

    			if (context.get(id)) {
    				$$invalidate(2, context$1 = context.get(id));
    				clearInterval(interval);
    			} else if (loop === 20) {
    				clearInterval(interval);
    			}
    		},
    		50
    	);

    	const writable_props = ['ref', 'classList', 'id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchInput> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		SearchInputHTML,
    		store: context,
    		ref,
    		classList,
    		id,
    		context: context$1,
    		loop,
    		interval
    	});

    	$$self.$inject_state = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    		if ('context' in $$props) $$invalidate(2, context$1 = $$props.context);
    		if ('loop' in $$props) loop = $$props.loop;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, classList, context$1, id];
    }

    class SearchInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { ref: 0, classList: 1, id: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchInput",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get ref() {
    		throw new Error("<SearchInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<SearchInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<SearchInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<SearchInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<SearchInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<SearchInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-simple-datatables\src\components\Search.svelte generated by Svelte v3.54.0 */
    const file$7 = "node_modules\\svelte-simple-datatables\\src\\components\\Search.svelte";

    function create_fragment$9(ctx) {
    	let section;
    	let searchinput;
    	let current;

    	searchinput = new SearchInput({
    			props: { id: /*id*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(searchinput.$$.fragment);
    			attr_dev(section, "class", "dt-search svelte-16n96wa");
    			toggle_class(section, "css", /*$options*/ ctx[2].css);
    			add_location(section, file$7, 7, 0, 112);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(searchinput, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const searchinput_changes = {};
    			if (dirty & /*id*/ 1) searchinput_changes.id = /*id*/ ctx[0];
    			searchinput.$set(searchinput_changes);

    			if (!current || dirty & /*$options*/ 4) {
    				toggle_class(section, "css", /*$options*/ ctx[2].css);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(searchinput);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $options,
    		$$unsubscribe_options = noop$3,
    		$$subscribe_options = () => ($$unsubscribe_options(), $$unsubscribe_options = subscribe(options, $$value => $$invalidate(2, $options = $$value)), options);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_options());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	let { id } = $$props;
    	let { options } = $$props;
    	validate_store(options, 'options');
    	$$subscribe_options();

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<Search> was created without expected prop 'id'");
    		}

    		if (options === undefined && !('options' in $$props || $$self.$$.bound[$$self.$$.props['options']])) {
    			console.warn("<Search> was created without expected prop 'options'");
    		}
    	});

    	const writable_props = ['id', 'options'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('options' in $$props) $$subscribe_options($$invalidate(1, options = $$props.options));
    	};

    	$$self.$capture_state = () => ({ SearchInput, id, options, $options });

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('options' in $$props) $$subscribe_options($$invalidate(1, options = $$props.options));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, options, $options];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { id: 0, options: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get id() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-simple-datatables\src\components\PaginationRowCountHTML.svelte generated by Svelte v3.54.0 */

    const file$6 = "node_modules\\svelte-simple-datatables\\src\\components\\PaginationRowCountHTML.svelte";

    // (28:1) {:else}
    function create_else_block_1(ctx) {
    	let html_tag;
    	let raw_value = `<b>${/*start*/ ctx[4]}</b>-<b>${/*end*/ ctx[3]}</b>/<b>${/*rows*/ ctx[2]}</b>` + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty$1();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*start, end, rows*/ 28 && raw_value !== (raw_value = `<b>${/*start*/ ctx[4]}</b>-<b>${/*end*/ ctx[3]}</b>/<b>${/*rows*/ ctx[2]}</b>` + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(28:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:1) {#if $datatableWidth > 600}
    function create_if_block$7(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*rows*/ ctx[2] > 0) return create_if_block_1$5;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(22:1) {#if $datatableWidth > 600}",
    		ctx
    	});

    	return block;
    }

    // (25:2) {:else}
    function create_else_block$2(ctx) {
    	let html_tag;
    	let raw_value = /*$options*/ ctx[5].labels.noRows + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty$1();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$options*/ 32 && raw_value !== (raw_value = /*$options*/ ctx[5].labels.noRows + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(25:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if rows > 0}
    function create_if_block_1$5(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty$1();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*info*/ ctx[6], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 64) html_tag.p(/*info*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(23:2) {#if rows > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let aside;
    	let aside_class_value;

    	function select_block_type(ctx, dirty) {
    		if (/*$datatableWidth*/ ctx[7] > 600) return create_if_block$7;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			if_block.c();
    			attr_dev(aside, "class", aside_class_value = "dt-pagination-rowcount " + /*classList*/ ctx[1] + " svelte-bzwyk1");
    			attr_dev(aside, "ref", /*ref*/ ctx[0]);
    			toggle_class(aside, "css", /*$options*/ ctx[5].css);
    			add_location(aside, file$6, 20, 0, 602);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			if_block.m(aside, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(aside, null);
    				}
    			}

    			if (dirty & /*classList*/ 2 && aside_class_value !== (aside_class_value = "dt-pagination-rowcount " + /*classList*/ ctx[1] + " svelte-bzwyk1")) {
    				attr_dev(aside, "class", aside_class_value);
    			}

    			if (dirty & /*ref*/ 1) {
    				attr_dev(aside, "ref", /*ref*/ ctx[0]);
    			}

    			if (dirty & /*classList, $options*/ 34) {
    				toggle_class(aside, "css", /*$options*/ ctx[5].css);
    			}
    		},
    		i: noop$3,
    		o: noop$3,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let start;
    	let end;
    	let rows;
    	let info;
    	let $options;
    	let $rowsCount;
    	let $pageNumber;
    	let $datatableWidth;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaginationRowCountHTML', slots, []);
    	let { context } = $$props;
    	let { ref = '' } = $$props;
    	let { classList = '' } = $$props;
    	const rowsCount = context.getRowsCount();
    	validate_store(rowsCount, 'rowsCount');
    	component_subscribe($$self, rowsCount, value => $$invalidate(13, $rowsCount = value));
    	const options = context.getOptions();
    	validate_store(options, 'options');
    	component_subscribe($$self, options, value => $$invalidate(5, $options = value));
    	const pageNumber = context.getPageNumber();
    	validate_store(pageNumber, 'pageNumber');
    	component_subscribe($$self, pageNumber, value => $$invalidate(14, $pageNumber = value));
    	const datatableWidth = context.getDatatableWidth();
    	validate_store(datatableWidth, 'datatableWidth');
    	component_subscribe($$self, datatableWidth, value => $$invalidate(7, $datatableWidth = value));

    	$$self.$$.on_mount.push(function () {
    		if (context === undefined && !('context' in $$props || $$self.$$.bound[$$self.$$.props['context']])) {
    			console.warn("<PaginationRowCountHTML> was created without expected prop 'context'");
    		}
    	});

    	const writable_props = ['context', 'ref', 'classList'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PaginationRowCountHTML> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('context' in $$props) $$invalidate(12, context = $$props.context);
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    	};

    	$$self.$capture_state = () => ({
    		context,
    		ref,
    		classList,
    		rowsCount,
    		options,
    		pageNumber,
    		datatableWidth,
    		rows,
    		end,
    		start,
    		info,
    		$options,
    		$rowsCount,
    		$pageNumber,
    		$datatableWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('context' in $$props) $$invalidate(12, context = $$props.context);
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('rows' in $$props) $$invalidate(2, rows = $$props.rows);
    		if ('end' in $$props) $$invalidate(3, end = $$props.end);
    		if ('start' in $$props) $$invalidate(4, start = $$props.start);
    		if ('info' in $$props) $$invalidate(6, info = $$props.info);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$pageNumber, $options*/ 16416) {
    			$$invalidate(4, start = $pageNumber * $options.rowsPerPage - $options.rowsPerPage + 1);
    		}

    		if ($$self.$$.dirty & /*$pageNumber, $options, $rowsCount*/ 24608) {
    			$$invalidate(3, end = Math.min($pageNumber * $options.rowsPerPage, $rowsCount));
    		}

    		if ($$self.$$.dirty & /*$rowsCount*/ 8192) {
    			$$invalidate(2, rows = $rowsCount);
    		}

    		if ($$self.$$.dirty & /*$options, start, end, rows*/ 60) {
    			$$invalidate(6, info = $options.labels.info.replace('{start}', `<b>${start}</b>`).replace('{end}', `<b>${end}</b>`).replace('{rows}', `<b>${rows}</b>`));
    		}
    	};

    	return [
    		ref,
    		classList,
    		rows,
    		end,
    		start,
    		$options,
    		info,
    		$datatableWidth,
    		rowsCount,
    		options,
    		pageNumber,
    		datatableWidth,
    		context,
    		$rowsCount,
    		$pageNumber
    	];
    }

    class PaginationRowCountHTML extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { context: 12, ref: 0, classList: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationRowCountHTML",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get context() {
    		throw new Error("<PaginationRowCountHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set context(value) {
    		throw new Error("<PaginationRowCountHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<PaginationRowCountHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<PaginationRowCountHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<PaginationRowCountHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<PaginationRowCountHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-simple-datatables\src\PaginationRowCount.svelte generated by Svelte v3.54.0 */

    // (23:0) {#if context}
    function create_if_block$6(ctx) {
    	let paginationrowcounthtml;
    	let current;

    	paginationrowcounthtml = new PaginationRowCountHTML({
    			props: {
    				context: /*context*/ ctx[2],
    				ref: /*ref*/ ctx[0],
    				classList: /*classList*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationrowcounthtml.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationrowcounthtml, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationrowcounthtml_changes = {};
    			if (dirty & /*context*/ 4) paginationrowcounthtml_changes.context = /*context*/ ctx[2];
    			if (dirty & /*ref*/ 1) paginationrowcounthtml_changes.ref = /*ref*/ ctx[0];
    			if (dirty & /*classList*/ 2) paginationrowcounthtml_changes.classList = /*classList*/ ctx[1];
    			paginationrowcounthtml.$set(paginationrowcounthtml_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationrowcounthtml.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationrowcounthtml.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationrowcounthtml, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(23:0) {#if context}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*context*/ ctx[2] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*context*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*context*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaginationRowCount', slots, []);
    	let { ref = '' } = $$props;
    	let { classList = '' } = $$props;
    	let { id = 'svelte-simple-datatable' } = $$props;
    	let context$1 = null;
    	let loop = 0;

    	const interval = setInterval(
    		() => {
    			loop++;

    			if (context.get(id)) {
    				$$invalidate(2, context$1 = context.get(id));
    				clearInterval(interval);
    			} else if (loop === 20) {
    				clearInterval(interval);
    			}
    		},
    		50
    	);

    	const writable_props = ['ref', 'classList', 'id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PaginationRowCount> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		PaginationRowCountHTML,
    		store: context,
    		ref,
    		classList,
    		id,
    		context: context$1,
    		loop,
    		interval
    	});

    	$$self.$inject_state = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    		if ('context' in $$props) $$invalidate(2, context$1 = $$props.context);
    		if ('loop' in $$props) loop = $$props.loop;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, classList, context$1, id];
    }

    class PaginationRowCount extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { ref: 0, classList: 1, id: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationRowCount",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get ref() {
    		throw new Error("<PaginationRowCount>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<PaginationRowCount>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<PaginationRowCount>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<PaginationRowCount>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<PaginationRowCount>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<PaginationRowCount>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-simple-datatables\src\components\PaginationButtonsHTML.svelte generated by Svelte v3.54.0 */

    const file$5 = "node_modules\\svelte-simple-datatables\\src\\components\\PaginationButtonsHTML.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    // (81:0) {:else}
    function create_else_block$1(ctx) {
    	let section;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let button3;
    	let section_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			button0 = element("button");
    			button0.textContent = "❬❬";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "❮";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "❯";
    			t5 = space();
    			button3 = element("button");
    			button3.textContent = "❭❭";
    			attr_dev(button0, "class", "svelte-1nr9gki");
    			toggle_class(button0, "disabled", /*$pageNumber*/ ctx[3] === 1);
    			add_location(button0, file$5, 85, 2, 2056);
    			attr_dev(button1, "class", "svelte-1nr9gki");
    			toggle_class(button1, "disabled", /*$pageNumber*/ ctx[3] === 1);
    			add_location(button1, file$5, 88, 2, 2165);
    			attr_dev(button2, "class", "svelte-1nr9gki");
    			toggle_class(button2, "disabled", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			add_location(button2, file$5, 92, 2, 2283);
    			attr_dev(button3, "class", "svelte-1nr9gki");
    			toggle_class(button3, "disabled", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			add_location(button3, file$5, 96, 2, 2416);
    			attr_dev(section, "class", section_class_value = "dt-pagination-buttons mobile " + /*classList*/ ctx[1] + " svelte-1nr9gki");
    			toggle_class(section, "css", /*$options*/ ctx[4].css);
    			add_location(section, file$5, 81, 1, 1960);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, button0);
    			append_dev(section, t1);
    			append_dev(section, button1);
    			append_dev(section, t3);
    			append_dev(section, button2);
    			append_dev(section, t5);
    			append_dev(section, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_5*/ ctx[19], false, false, false),
    					listen_dev(button1, "click", /*click_handler_6*/ ctx[20], false, false, false),
    					listen_dev(button2, "click", /*click_handler_7*/ ctx[21], false, false, false),
    					listen_dev(button3, "click", /*click_handler_8*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$pageNumber*/ 8) {
    				toggle_class(button0, "disabled", /*$pageNumber*/ ctx[3] === 1);
    			}

    			if (dirty & /*$pageNumber*/ 8) {
    				toggle_class(button1, "disabled", /*$pageNumber*/ ctx[3] === 1);
    			}

    			if (dirty & /*$pageNumber, pageCount*/ 12) {
    				toggle_class(button2, "disabled", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			}

    			if (dirty & /*$pageNumber, pageCount*/ 12) {
    				toggle_class(button3, "disabled", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			}

    			if (dirty & /*classList*/ 2 && section_class_value !== (section_class_value = "dt-pagination-buttons mobile " + /*classList*/ ctx[1] + " svelte-1nr9gki")) {
    				attr_dev(section, "class", section_class_value);
    			}

    			if (dirty & /*classList, $options*/ 18) {
    				toggle_class(section, "css", /*$options*/ ctx[4].css);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(81:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:0) {#if $datatableWidth > 600}
    function create_if_block$5(ctx) {
    	let section;
    	let button0;
    	let raw0_value = /*$options*/ ctx[4].labels.previous + "";
    	let t0;
    	let button1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let button2;
    	let raw1_value = /*$options*/ ctx[4].labels.next + "";
    	let section_class_value;
    	let mounted;
    	let dispose;
    	let if_block0 = /*pageCount*/ ctx[2].length > 6 && /*$pageNumber*/ ctx[3] >= 5 && create_if_block_4$1(ctx);
    	let each_value = /*buttons*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	let if_block1 = /*pageCount*/ ctx[2].length > 6 && /*$pageNumber*/ ctx[3] <= /*pageCount*/ ctx[2].length - 3 && create_if_block_2$3(ctx);
    	let if_block2 = /*pageCount*/ ctx[2].length > 1 && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			button0 = element("button");
    			t0 = space();
    			button1 = element("button");
    			button1.textContent = "1";
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			if (if_block2) if_block2.c();
    			t6 = space();
    			button2 = element("button");
    			attr_dev(button0, "class", "text svelte-1nr9gki");
    			toggle_class(button0, "disabled", /*$pageNumber*/ ctx[3] === 1);
    			add_location(button0, file$5, 34, 2, 858);
    			attr_dev(button1, "class", "svelte-1nr9gki");
    			toggle_class(button1, "active", /*$pageNumber*/ ctx[3] === 1);
    			add_location(button1, file$5, 41, 2, 1026);
    			attr_dev(button2, "class", "text svelte-1nr9gki");
    			toggle_class(button2, "disabled", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			add_location(button2, file$5, 72, 2, 1760);
    			attr_dev(section, "class", section_class_value = "dt-pagination-buttons " + /*classList*/ ctx[1] + " svelte-1nr9gki");
    			attr_dev(section, "ref", /*ref*/ ctx[0]);
    			toggle_class(section, "css", /*$options*/ ctx[4].css);
    			add_location(section, file$5, 29, 1, 760);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, button0);
    			button0.innerHTML = raw0_value;
    			append_dev(section, t0);
    			append_dev(section, button1);
    			append_dev(section, t2);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			append_dev(section, t4);
    			if (if_block1) if_block1.m(section, null);
    			append_dev(section, t5);
    			if (if_block2) if_block2.m(section, null);
    			append_dev(section, t6);
    			append_dev(section, button2);
    			button2.innerHTML = raw1_value;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[14], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[15], false, false, false),
    					listen_dev(button2, "click", /*click_handler_4*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$options*/ 16 && raw0_value !== (raw0_value = /*$options*/ ctx[4].labels.previous + "")) button0.innerHTML = raw0_value;
    			if (dirty & /*$pageNumber*/ 8) {
    				toggle_class(button0, "disabled", /*$pageNumber*/ ctx[3] === 1);
    			}

    			if (dirty & /*$pageNumber*/ 8) {
    				toggle_class(button1, "active", /*$pageNumber*/ ctx[3] === 1);
    			}

    			if (/*pageCount*/ ctx[2].length > 6 && /*$pageNumber*/ ctx[3] >= 5) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					if_block0.m(section, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*$pageNumber, buttons, setPage, pageCount*/ 2092) {
    				each_value = /*buttons*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(section, t4);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*pageCount*/ ctx[2].length > 6 && /*$pageNumber*/ ctx[3] <= /*pageCount*/ ctx[2].length - 3) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_2$3(ctx);
    					if_block1.c();
    					if_block1.m(section, t5);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*pageCount*/ ctx[2].length > 1) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$4(ctx);
    					if_block2.c();
    					if_block2.m(section, t6);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*$options*/ 16 && raw1_value !== (raw1_value = /*$options*/ ctx[4].labels.next + "")) button2.innerHTML = raw1_value;
    			if (dirty & /*$pageNumber, pageCount*/ 12) {
    				toggle_class(button2, "disabled", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			}

    			if (dirty & /*classList*/ 2 && section_class_value !== (section_class_value = "dt-pagination-buttons " + /*classList*/ ctx[1] + " svelte-1nr9gki")) {
    				attr_dev(section, "class", section_class_value);
    			}

    			if (dirty & /*ref*/ 1) {
    				attr_dev(section, "ref", /*ref*/ ctx[0]);
    			}

    			if (dirty & /*classList, $options*/ 18) {
    				toggle_class(section, "css", /*$options*/ ctx[4].css);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(29:0) {#if $datatableWidth > 600}",
    		ctx
    	});

    	return block;
    }

    // (45:2) {#if pageCount.length > 6 && $pageNumber >= 5}
    function create_if_block_4$1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "...";
    			attr_dev(button, "class", "ellipse svelte-1nr9gki");
    			add_location(button, file$5, 45, 3, 1169);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(45:2) {#if pageCount.length > 6 && $pageNumber >= 5}",
    		ctx
    	});

    	return block;
    }

    // (50:3) {#if n > 0 && n < pageCount.length - 1}
    function create_if_block_3$1(ctx) {
    	let button;
    	let t_value = /*n*/ ctx[24] + 1 + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[16](/*n*/ ctx[24]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text$1(t_value);
    			attr_dev(button, "class", "svelte-1nr9gki");
    			toggle_class(button, "active", /*$pageNumber*/ ctx[3] === /*n*/ ctx[24] + 1);
    			add_location(button, file$5, 50, 4, 1290);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*buttons*/ 32 && t_value !== (t_value = /*n*/ ctx[24] + 1 + "")) set_data_dev(t, t_value);

    			if (dirty & /*$pageNumber, buttons*/ 40) {
    				toggle_class(button, "active", /*$pageNumber*/ ctx[3] === /*n*/ ctx[24] + 1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(50:3) {#if n > 0 && n < pageCount.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (49:2) {#each buttons as n}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*n*/ ctx[24] > 0 && /*n*/ ctx[24] < /*pageCount*/ ctx[2].length - 1 && create_if_block_3$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*n*/ ctx[24] > 0 && /*n*/ ctx[24] < /*pageCount*/ ctx[2].length - 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(49:2) {#each buttons as n}",
    		ctx
    	});

    	return block;
    }

    // (60:2) {#if pageCount.length > 6 && $pageNumber <= pageCount.length - 3}
    function create_if_block_2$3(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "...";
    			attr_dev(button, "class", "ellipse svelte-1nr9gki");
    			add_location(button, file$5, 60, 3, 1511);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(60:2) {#if pageCount.length > 6 && $pageNumber <= pageCount.length - 3}",
    		ctx
    	});

    	return block;
    }

    // (64:2) {#if pageCount.length > 1}
    function create_if_block_1$4(ctx) {
    	let button;
    	let t_value = /*pageCount*/ ctx[2].length + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text$1(t_value);
    			attr_dev(button, "class", "svelte-1nr9gki");
    			toggle_class(button, "active", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			add_location(button, file$5, 64, 3, 1593);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[17], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pageCount*/ 4 && t_value !== (t_value = /*pageCount*/ ctx[2].length + "")) set_data_dev(t, t_value);

    			if (dirty & /*$pageNumber, pageCount*/ 12) {
    				toggle_class(button, "active", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(64:2) {#if pageCount.length > 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$datatableWidth*/ ctx[6] > 600) return create_if_block$5;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop$3,
    		o: noop$3,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let pageCount;
    	let buttons;
    	let $pageNumber;
    	let $options;
    	let $rowsCount;
    	let $datatableWidth;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaginationButtonsHTML', slots, []);
    	let { context } = $$props;
    	let { ref = '' } = $$props;
    	let { classList = '' } = $$props;
    	const rowsCount = context.getRowsCount();
    	validate_store(rowsCount, 'rowsCount');
    	component_subscribe($$self, rowsCount, value => $$invalidate(13, $rowsCount = value));
    	const options = context.getOptions();
    	validate_store(options, 'options');
    	component_subscribe($$self, options, value => $$invalidate(4, $options = value));
    	const pageNumber = context.getPageNumber();
    	validate_store(pageNumber, 'pageNumber');
    	component_subscribe($$self, pageNumber, value => $$invalidate(3, $pageNumber = value));
    	const datatableWidth = context.getDatatableWidth();
    	validate_store(datatableWidth, 'datatableWidth');
    	component_subscribe($$self, datatableWidth, value => $$invalidate(6, $datatableWidth = value));

    	const slice = (arr, page) => {
    		if (page < 5) {
    			return arr.slice(0, 5);
    		} else if (page > arr.length - 4) {
    			return arr.slice(arr.length - 5, arr.length);
    		}

    		return arr.slice(page - 2, page + 1);
    	};

    	const setPage = number => {
    		pageNumber.set(number);
    		context.getColumns().redraw();
    	};

    	$$self.$$.on_mount.push(function () {
    		if (context === undefined && !('context' in $$props || $$self.$$.bound[$$self.$$.props['context']])) {
    			console.warn("<PaginationButtonsHTML> was created without expected prop 'context'");
    		}
    	});

    	const writable_props = ['context', 'ref', 'classList'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PaginationButtonsHTML> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => setPage($pageNumber - 1);
    	const click_handler_1 = () => setPage(1);
    	const click_handler_2 = n => setPage(n + 1);
    	const click_handler_3 = () => setPage(pageCount.length);
    	const click_handler_4 = () => setPage($pageNumber + 1);
    	const click_handler_5 = () => setPage(1);
    	const click_handler_6 = () => setPage($pageNumber - 1);
    	const click_handler_7 = () => setPage($pageNumber + 1);
    	const click_handler_8 = () => setPage(pageCount.length);

    	$$self.$$set = $$props => {
    		if ('context' in $$props) $$invalidate(12, context = $$props.context);
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    	};

    	$$self.$capture_state = () => ({
    		context,
    		ref,
    		classList,
    		rowsCount,
    		options,
    		pageNumber,
    		datatableWidth,
    		slice,
    		setPage,
    		pageCount,
    		buttons,
    		$pageNumber,
    		$options,
    		$rowsCount,
    		$datatableWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('context' in $$props) $$invalidate(12, context = $$props.context);
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('pageCount' in $$props) $$invalidate(2, pageCount = $$props.pageCount);
    		if ('buttons' in $$props) $$invalidate(5, buttons = $$props.buttons);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$rowsCount, $options*/ 8208) {
    			$$invalidate(2, pageCount = Array.from(Array(Math.ceil($rowsCount / $options.rowsPerPage)).keys()));
    		}

    		if ($$self.$$.dirty & /*pageCount, $pageNumber*/ 12) {
    			$$invalidate(5, buttons = slice(pageCount, $pageNumber));
    		}
    	};

    	return [
    		ref,
    		classList,
    		pageCount,
    		$pageNumber,
    		$options,
    		buttons,
    		$datatableWidth,
    		rowsCount,
    		options,
    		pageNumber,
    		datatableWidth,
    		setPage,
    		context,
    		$rowsCount,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8
    	];
    }

    class PaginationButtonsHTML extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { context: 12, ref: 0, classList: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationButtonsHTML",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get context() {
    		throw new Error("<PaginationButtonsHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set context(value) {
    		throw new Error("<PaginationButtonsHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<PaginationButtonsHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<PaginationButtonsHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<PaginationButtonsHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<PaginationButtonsHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-simple-datatables\src\PaginationButtons.svelte generated by Svelte v3.54.0 */

    // (23:0) {#if context}
    function create_if_block$4(ctx) {
    	let paginationbuttonshtml;
    	let current;

    	paginationbuttonshtml = new PaginationButtonsHTML({
    			props: {
    				context: /*context*/ ctx[2],
    				ref: /*ref*/ ctx[0],
    				classList: /*classList*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationbuttonshtml.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationbuttonshtml, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationbuttonshtml_changes = {};
    			if (dirty & /*context*/ 4) paginationbuttonshtml_changes.context = /*context*/ ctx[2];
    			if (dirty & /*ref*/ 1) paginationbuttonshtml_changes.ref = /*ref*/ ctx[0];
    			if (dirty & /*classList*/ 2) paginationbuttonshtml_changes.classList = /*classList*/ ctx[1];
    			paginationbuttonshtml.$set(paginationbuttonshtml_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationbuttonshtml.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationbuttonshtml.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationbuttonshtml, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(23:0) {#if context}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*context*/ ctx[2] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*context*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*context*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaginationButtons', slots, []);
    	let { ref = '' } = $$props;
    	let { classList = '' } = $$props;
    	let { id = 'svelte-simple-datatable' } = $$props;
    	let context$1 = null;
    	let loop = 0;

    	const interval = setInterval(
    		() => {
    			loop++;

    			if (context.get(id)) {
    				$$invalidate(2, context$1 = context.get(id));
    				clearInterval(interval);
    			} else if (loop === 24) {
    				clearInterval(interval);
    			}
    		},
    		50
    	);

    	const writable_props = ['ref', 'classList', 'id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PaginationButtons> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		PaginationButtonsHTML,
    		store: context,
    		ref,
    		classList,
    		id,
    		context: context$1,
    		loop,
    		interval
    	});

    	$$self.$inject_state = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    		if ('context' in $$props) $$invalidate(2, context$1 = $$props.context);
    		if ('loop' in $$props) loop = $$props.loop;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, classList, context$1, id];
    }

    class PaginationButtons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { ref: 0, classList: 1, id: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationButtons",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get ref() {
    		throw new Error("<PaginationButtons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<PaginationButtons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<PaginationButtons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<PaginationButtons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<PaginationButtons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<PaginationButtons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-simple-datatables\src\components\Pagination.svelte generated by Svelte v3.54.0 */
    const file$4 = "node_modules\\svelte-simple-datatables\\src\\components\\Pagination.svelte";

    // (9:0) {#if $options.pagination && ($options.blocks.paginationRowCount || $options.blocks.paginationButtons)}
    function create_if_block$3(ctx) {
    	let section;
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_2$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$options*/ ctx[2].blocks.paginationRowCount) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*$options*/ ctx[2].blocks.paginationButtons && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(section, "class", "dt-pagination svelte-1thvc3t");
    			toggle_class(section, "css", /*$options*/ ctx[2].css);
    			add_location(section, file$4, 9, 1, 293);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if_blocks[current_block_type_index].m(section, null);
    			append_dev(section, t);
    			if (if_block1) if_block1.m(section, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(section, t);
    			}

    			if (/*$options*/ ctx[2].blocks.paginationButtons) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$options*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(section, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$options*/ 4) {
    				toggle_class(section, "css", /*$options*/ ctx[2].css);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(9:0) {#if $options.pagination && ($options.blocks.paginationRowCount || $options.blocks.paginationButtons)}",
    		ctx
    	});

    	return block;
    }

    // (13:2) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file$4, 13, 3, 441);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$3,
    		i: noop$3,
    		o: noop$3,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(13:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:2) {#if $options.blocks.paginationRowCount}
    function create_if_block_2$2(ctx) {
    	let paginationrowcount;
    	let current;

    	paginationrowcount = new PaginationRowCount({
    			props: { id: /*id*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationrowcount.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationrowcount, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationrowcount_changes = {};
    			if (dirty & /*id*/ 1) paginationrowcount_changes.id = /*id*/ ctx[0];
    			paginationrowcount.$set(paginationrowcount_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationrowcount.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationrowcount.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationrowcount, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(11:2) {#if $options.blocks.paginationRowCount}",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#if $options.blocks.paginationButtons}
    function create_if_block_1$3(ctx) {
    	let paginationbuttons;
    	let current;

    	paginationbuttons = new PaginationButtons({
    			props: { id: /*id*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationbuttons.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationbuttons, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationbuttons_changes = {};
    			if (dirty & /*id*/ 1) paginationbuttons_changes.id = /*id*/ ctx[0];
    			paginationbuttons.$set(paginationbuttons_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationbuttons.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationbuttons.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationbuttons, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(16:2) {#if $options.blocks.paginationButtons}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$options*/ ctx[2].pagination && (/*$options*/ ctx[2].blocks.paginationRowCount || /*$options*/ ctx[2].blocks.paginationButtons) && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$options*/ ctx[2].pagination && (/*$options*/ ctx[2].blocks.paginationRowCount || /*$options*/ ctx[2].blocks.paginationButtons)) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$options*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $options,
    		$$unsubscribe_options = noop$3,
    		$$subscribe_options = () => ($$unsubscribe_options(), $$unsubscribe_options = subscribe(options, $$value => $$invalidate(2, $options = $$value)), options);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_options());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pagination', slots, []);
    	let { id } = $$props;
    	let { options } = $$props;
    	validate_store(options, 'options');
    	$$subscribe_options();

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<Pagination> was created without expected prop 'id'");
    		}

    		if (options === undefined && !('options' in $$props || $$self.$$.bound[$$self.$$.props['options']])) {
    			console.warn("<Pagination> was created without expected prop 'options'");
    		}
    	});

    	const writable_props = ['id', 'options'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pagination> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('options' in $$props) $$subscribe_options($$invalidate(1, options = $$props.options));
    	};

    	$$self.$capture_state = () => ({
    		PaginationRowCount,
    		PaginationButtons,
    		id,
    		options,
    		$options
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('options' in $$props) $$subscribe_options($$invalidate(1, options = $$props.options));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, options, $options];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { id: 0, options: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get id() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const header = {
        removeOriginalThead: (id) => {
            setTimeout(() => {
                const thead = document.querySelector(`#${id} table thead`);
                const originHeight = thead.getBoundingClientRect().height;
                thead.parentNode.style.marginTop = '-' + (originHeight) + 'px';
                thead.style.visibility = 'hidden';
            }, 50);
        },
        getOrginalTHeadClassList: (id) => {
            return document.querySelector(`#${id} table thead`).classList
        },
    };

    /* node_modules\svelte-simple-datatables\src\components\StickyHeader.svelte generated by Svelte v3.54.0 */
    const file$3 = "node_modules\\svelte-simple-datatables\\src\\components\\StickyHeader.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (24:3) {#each $columns as th}
    function create_each_block_1$1(ctx) {
    	let th;
    	let html_tag;
    	let raw_value = /*th*/ ctx[8].html + "";
    	let span;
    	let t;
    	let th_class_value;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[6](/*th*/ ctx[8], ...args);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			html_tag = new HtmlTag(false);
    			span = element("span");
    			t = space();
    			html_tag.a = span;
    			attr_dev(span, "class", "svelte-1x5myu9");
    			add_location(span, file$3, 31, 20, 745);
    			attr_dev(th, "nowrap", "");
    			set_style(th, "min-width", /*th*/ ctx[8].minWidth + "px");
    			attr_dev(th, "class", th_class_value = "" + (null_to_empty(/*th*/ ctx[8].classList) + " svelte-1x5myu9"));
    			toggle_class(th, "sortable", /*th*/ ctx[8].key && /*$options*/ ctx[3].sortable === true);
    			add_location(th, file$3, 24, 4, 517);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			html_tag.m(raw_value, th);
    			append_dev(th, span);
    			append_dev(th, t);

    			if (!mounted) {
    				dispose = listen_dev(th, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$columns*/ 16 && raw_value !== (raw_value = /*th*/ ctx[8].html + "")) html_tag.p(raw_value);

    			if (dirty & /*$columns*/ 16) {
    				set_style(th, "min-width", /*th*/ ctx[8].minWidth + "px");
    			}

    			if (dirty & /*$columns*/ 16 && th_class_value !== (th_class_value = "" + (null_to_empty(/*th*/ ctx[8].classList) + " svelte-1x5myu9"))) {
    				attr_dev(th, "class", th_class_value);
    			}

    			if (dirty & /*$columns, $columns, $options*/ 24) {
    				toggle_class(th, "sortable", /*th*/ ctx[8].key && /*$options*/ ctx[3].sortable === true);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(24:3) {#each $columns as th}",
    		ctx
    	});

    	return block;
    }

    // (36:2) {#if $options.columnFilter === true}
    function create_if_block$2(ctx) {
    	let tr;
    	let each_value = /*$columns*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tr, file$3, 36, 3, 830);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$columns, $options, columns*/ 26) {
    				each_value = /*$columns*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(36:2) {#if $options.columnFilter === true}",
    		ctx
    	});

    	return block;
    }

    // (40:6) {#if th.key}
    function create_if_block_1$2(ctx) {
    	let input;
    	let input_placeholder_value;
    	let mounted;
    	let dispose;

    	function input_handler(...args) {
    		return /*input_handler*/ ctx[7](/*th*/ ctx[8], ...args);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", input_placeholder_value = /*$options*/ ctx[3].labels.filter);
    			attr_dev(input, "class", "browser-default svelte-1x5myu9");
    			add_location(input, file$3, 40, 7, 955);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$options*/ 8 && input_placeholder_value !== (input_placeholder_value = /*$options*/ ctx[3].labels.filter)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(40:6) {#if th.key}",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#each $columns as th}
    function create_each_block$1(ctx) {
    	let th;
    	let t;
    	let if_block = /*th*/ ctx[8].key && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			th = element("th");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(th, "class", "filter svelte-1x5myu9");
    			set_style(th, "width", /*th*/ ctx[8].width);
    			set_style(th, "height", "25px");
    			add_location(th, file$3, 38, 5, 869);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			if (if_block) if_block.m(th, null);
    			append_dev(th, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*th*/ ctx[8].key) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(th, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*$columns*/ 16) {
    				set_style(th, "width", /*th*/ ctx[8].width);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(38:4) {#each $columns as th}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let section;
    	let thead;
    	let tr;
    	let t;
    	let thead_class_value;
    	let each_value_1 = /*$columns*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let if_block = /*$options*/ ctx[3].columnFilter === true && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			thead = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			add_location(tr, file$3, 22, 2, 480);
    			attr_dev(thead, "class", thead_class_value = "" + (null_to_empty(/*theadClassList*/ ctx[2]) + " svelte-1x5myu9"));
    			add_location(thead, file$3, 21, 1, 446);
    			attr_dev(section, "class", "dt-header svelte-1x5myu9");
    			toggle_class(section, "sortable", /*$options*/ ctx[3].sortable === true);
    			toggle_class(section, "css", /*$options*/ ctx[3].css);
    			add_location(section, file$3, 16, 0, 339);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, thead);
    			append_dev(thead, tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(thead, t);
    			if (if_block) if_block.m(thead, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$columns, $options, columns*/ 26) {
    				each_value_1 = /*$columns*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*$options*/ ctx[3].columnFilter === true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(thead, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*theadClassList*/ 4 && thead_class_value !== (thead_class_value = "" + (null_to_empty(/*theadClassList*/ ctx[2]) + " svelte-1x5myu9"))) {
    				attr_dev(thead, "class", thead_class_value);
    			}

    			if (dirty & /*$options*/ 8) {
    				toggle_class(section, "sortable", /*$options*/ ctx[3].sortable === true);
    			}

    			if (dirty & /*$options*/ 8) {
    				toggle_class(section, "css", /*$options*/ ctx[3].css);
    			}
    		},
    		i: noop$3,
    		o: noop$3,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $options,
    		$$unsubscribe_options = noop$3,
    		$$subscribe_options = () => ($$unsubscribe_options(), $$unsubscribe_options = subscribe(options, $$value => $$invalidate(3, $options = $$value)), options);

    	let $columns,
    		$$unsubscribe_columns = noop$3,
    		$$subscribe_columns = () => ($$unsubscribe_columns(), $$unsubscribe_columns = subscribe(columns, $$value => $$invalidate(4, $columns = $$value)), columns);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_options());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_columns());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StickyHeader', slots, []);
    	let { id = 'svelte-simple-datatable' } = $$props;
    	let { options } = $$props;
    	validate_store(options, 'options');
    	$$subscribe_options();
    	let { columns } = $$props;
    	validate_store(columns, 'columns');
    	$$subscribe_columns();
    	let theadClassList;

    	onMount(() => {
    		columns.draw();
    		header.removeOriginalThead(id);
    		$$invalidate(2, theadClassList = header.getOrginalTHeadClassList(id));
    	});

    	$$self.$$.on_mount.push(function () {
    		if (options === undefined && !('options' in $$props || $$self.$$.bound[$$self.$$.props['options']])) {
    			console.warn("<StickyHeader> was created without expected prop 'options'");
    		}

    		if (columns === undefined && !('columns' in $$props || $$self.$$.bound[$$self.$$.props['columns']])) {
    			console.warn("<StickyHeader> was created without expected prop 'columns'");
    		}
    	});

    	const writable_props = ['id', 'options', 'columns'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StickyHeader> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (th, e) => columns.sort(e.target, th.key);
    	const input_handler = (th, e) => columns.filter(th.key, e.target.value);

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(5, id = $$props.id);
    		if ('options' in $$props) $$subscribe_options($$invalidate(0, options = $$props.options));
    		if ('columns' in $$props) $$subscribe_columns($$invalidate(1, columns = $$props.columns));
    	};

    	$$self.$capture_state = () => ({
    		header,
    		onMount,
    		id,
    		options,
    		columns,
    		theadClassList,
    		$options,
    		$columns
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(5, id = $$props.id);
    		if ('options' in $$props) $$subscribe_options($$invalidate(0, options = $$props.options));
    		if ('columns' in $$props) $$subscribe_columns($$invalidate(1, columns = $$props.columns));
    		if ('theadClassList' in $$props) $$invalidate(2, theadClassList = $$props.theadClassList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		options,
    		columns,
    		theadClassList,
    		$options,
    		$columns,
    		id,
    		click_handler,
    		input_handler
    	];
    }

    class StickyHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { id: 5, options: 0, columns: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StickyHeader",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get id() {
    		throw new Error("<StickyHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<StickyHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<StickyHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<StickyHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columns() {
    		throw new Error("<StickyHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columns(value) {
    		throw new Error("<StickyHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class options
    {
        create()
        {
            const {subscribe, set } = writable({
                sortable: true,
                pagination: true,
                rowsPerPage: 50,
                columnFilter: false,
                scrollY: true,
                css: true,
                labels: {
                    search: 'Search...',
                    filter: 'Filter',
                    noRows: 'No entries to found',
                    info: 'Showing {start} to {end} of {rows} entries',
                    previous: 'Previous',
                    next: 'Next',
                },
                blocks: {
                    searchInput: true, 
                    paginationButtons: true,
                    paginationRowCount: true,
                }
            });
            return {
                subscribe, set, 
                get: (self) => {
                    let $store;
                    self.subscribe(store => $store = store);
                    return $store
                },
                parse: (opt) => {
                    opt.labels = opt.labels ?? {};
                    const labels = {
                        search:   typeof opt.labels.search   === 'string' ? opt.labels.search   : 'Search...',
                        filter:   typeof opt.labels.filter   === 'string' ? opt.labels.filter   : 'Filter',
                        noRows:   typeof opt.labels.noRows   === 'string' ? opt.labels.noRows   : 'No entries to found',
                        info:     typeof opt.labels.info     === 'string' ? opt.labels.info     : 'Showing {start} to {end} of {rows} entries',
                        previous: typeof opt.labels.previous === 'string' ? opt.labels.previous : 'Previous',
                        next:     typeof opt.labels.next     === 'string' ? opt.labels.next     : 'Next',                
                    };   
                    opt.blocks = opt.blocks ?? {};
                    const blocks = {
                        searchInput:        typeof opt.blocks.searchInput        === 'boolean' ? opt.blocks.searchInput        : true, 
                        paginationButtons:  typeof opt.blocks.paginationButtons  === 'boolean' ? opt.blocks.paginationButtons  : true,
                        paginationRowCount: typeof opt.blocks.paginationRowCount === 'boolean' ? opt.blocks.paginationRowCount : true,
                    };
                    return {
                        sortable:     typeof opt.sortable       === 'boolean' ? opt.sortable      : true,
                        pagination:   typeof opt.pagination     === 'boolean' ? opt.pagination    : true,
                        rowsPerPage:  typeof opt.rowsPerPage    === 'number'  ? opt.rowsPerPage   : 50,
                        columnFilter: typeof opt.columnFilter   === 'boolean' ? opt.columnFilter  : false, 
                        scrollY:      typeof opt.scrollY        === 'boolean' ? opt.scrollY       : true, 
                        css:          typeof opt.css            === 'boolean' ? opt.css           : true, 
                        labels: labels,
                        blocks: blocks
                    }
                }
            }
        }
    }

    class States
    {
        create(options, identifier = null) 
        {
            const id = this.createId(identifier);
            const rowsCount = this.createRowsCount();
            return {
                rowsCount: rowsCount,
                id: id,
                pageNumber: this.createPageNumber(id, options, rowsCount),
                datatableWidth: this.createDatatableWidth()

            }
        }

        createPageNumber(id, options, rowsCount)
        {
            const { subscribe, update } = writable(1);
            return {
                subscribe, update,
                set: (number) => update( store => {
                    let $rowsPerPage, $rowsCount;
                    rowsCount.subscribe(store => $rowsCount = store);
                    options.subscribe(store => $rowsPerPage = store.rowsPerPage);
        
                    if ( number >= 1 && number <= Math.ceil($rowsCount / $rowsPerPage) ) {
                        store = parseInt(number);
                    }
                    document.querySelector(`#${id.get()} .dt-table`).scrollTop = 0;
                    return store
                })
            }
        }

        createId(identifier = null)
        {
            const id = identifier ?? 'ssd-' + (Math.random() + 1).toString(36).substring(5);
    		const { subscribe } = readable(id);
    		return {
    			subscribe,
    			get: () => { return id }
    		}
        }

        createRowsCount()
        {
            return writable(0)
        }

        createDatatableWidth()
        {
            return writable(null)
        }
    }

    class Filters 
    {
        create() 
        {
            return {
                globalFilter: this.createGlobalFilter(),
                localFilters: this.createLocalFilters()
            }
        }
        
        createLocalFilters() 
        {
            const { subscribe, update } = writable([]);
            return {
                subscribe, update,
                add: (key, value) => update(store => {
                    const filter = {key: key, value: value}; 
                    store = store.filter(item => { return item.key !== key && item.value.length > 0 });
                    store.push(filter);
                    return store
                }),
                remove: () => update(store => [])
            }
        }

        createGlobalFilter()
        {
            const { subscribe, update } = writable(null);
            return {
                subscribe, 
                set: (value) => update(store => {
                    store = (value.length > 0) ? value : null;
                    return store
                }),
                remove: () => update(store => null)
            }
        }
    }

    class Data 
    {
        create(states, filters, options)
        {
            const data = this.createData();
            const filtered = this.createFiltered(data, states.rowsCount, filters.globalFilter, filters.localFilters);
            const rows = this.createRows(filtered, options, states.pageNumber);
            return {
                data: data,
                filtered: filtered,
                rows: rows
            }
        }

        createData()
        {
            const { subscribe, set, update } = writable([]);
            return {
                subscribe, set,
                sortAsc: (key) => update(store => {
                    try {
                        store.sort( (a, b) => {
                            if ( typeof( key(b) ) === "boolean" ) {
                                return key(a) ? 1 : -1
                            } else {
                                return key(b).localeCompare(key(a)) 
                            }									
                        });
        
                        return store
                    } catch (e) {
                        return store.sort( (a, b) => parseFloat(key(b)) - parseFloat(key(a)))
                    }
                    //return store.sort( (a, b) => key(b).localeCompare(key(a)) )
                    
                }),
                sortDesc: (key) => update(store => {
                    try {
                        store.sort( (a, b) => {
                            if ( typeof(key(b) ) === "boolean" ) {
                                return key(a) ? -1 : 1
                            } else {
                                return key(a).localeCompare(key(b)) 
                            }									
                        });
        
                        return store					
                    } catch (e) {
                        return store.sort( (a, b) => parseFloat(key(a)) - parseFloat(key(b)))
                    }
                    //return store.sort( (a, b) => key(a).localeCompare(key(b)) )
                }),
            }
        }

        createFiltered(data, rowsCount, globalFilter, localFilters) 
        {
            return derived(
                [data, globalFilter, localFilters],
                ([$data, $globalFilter, $localFilters]) => {
                    if ($globalFilter) {
                        $data = $data.filter( item => {
                            return Object.keys(item).some( k => {
                                return item[k].toString().toLowerCase().indexOf($globalFilter.toString().toLowerCase()) > -1
                            })
                        });
                    }
                    if ($localFilters.length > 0) {
                        $localFilters.forEach(filter => {
                            return $data = $data.filter( item => filter.key(item).toString().toLowerCase().indexOf(filter.value.toString().toLowerCase()) > -1)
                        });
                    }
                    rowsCount.set($data.length);
                    return $data
                } 	
            )
        }

        createRows(filtered, options, pageNumber)
        {
            return derived(
                [filtered, options, pageNumber],
                ([$filtered, $options, $pageNumber]) => {
                    if (!$options.pagination) {
                        return $filtered
                    }
                    return $filtered.slice( ($pageNumber - 1) * $options.rowsPerPage, $pageNumber * $options.rowsPerPage) 
                }
            ) 
        }
    }

    class Columns 
    {
        create(data, states, filters, options)
        {
    		const id = states.id;
    		this.id = id.get();
    		const pageNumber = states.pageNumber;
    		const localFilters = filters.localFilters;
            const { subscribe, set, update } = writable([]);
    		return {
    			subscribe, set, update,
    			get: (self) => {
    				let $columns;
    				self.subscribe(store => $columns = store);
    				return $columns
    			},
    			sort: (element, key) => {
    				if (options.get(options).sortable !== true || typeof key === 'undefined') {
    					return
    				}
    				if (
    					element.classList.contains('sortable') &&
    					element.classList.contains('asc')
    				) {
    					Array.from(element.parentNode.children).forEach((item) =>
    						item.classList.remove('asc', 'desc')
    					);
    					element.classList.add('desc');
    					data.sortDesc(key);
    					pageNumber.set(1);
    				} else {
    					Array.from(element.parentNode.children).forEach((item) =>
    						item.classList.remove('desc', 'asc')
    					);
    					element.classList.add('asc');
    					data.sortAsc(key);
    					pageNumber.set(1);
    				}
    				this.get(this.id).redraw();
    			},
    			filter: (key, value) => {
    				pageNumber.set(1);
    				localFilters.add(key, value);
    				this.get(this.id).redraw();
    			},
    			draw: () => {
    				setTimeout(() => {
    					const tbody = document.querySelector(`#${id.get()} table tbody tr`);
    					if (tbody === null) return
    					const thead = document.querySelectorAll(`#${id.get()} .dt-header thead tr`);
    					const $columns = this.getData(this.id);

    					thead[0].children[0];
    					Array.from(tbody.children)[0];

    					thead.forEach(tr => {
    						let i = 0;
    						Array.from(tbody.children).forEach(td => {
    							let th = tr.children[i];
    							let thW = th.getBoundingClientRect().width;
    							let tdW = td.getBoundingClientRect().width;
    							if (tdW > thW) { 
    								th.style.minWidth = tdW + 'px';
    								th.style.maxWidth = tdW + 'px';
    								$columns[i].minWidth = tdW;
    							}
    							else {
    								td.style.minWidth = thW + 'px';
    								td.style.maxWidth = thW + 'px';
    								$columns[i].minWidth = thW;
    							} 
    							i++;
    						});
    					});
    				}, 50);	
    			},
    			redraw: () => {
    				if ( options.get(options).scrollY === false ) return
    				
    				setTimeout(() => {
    					const tbody = document.querySelector(`#${id.get()} table tbody tr`);
    					if (tbody === null) return
    					const thead = document.querySelectorAll(`#${id.get()} .dt-header thead tr`);
    					const $columns = this.getData(this.id);
    					thead.forEach(tr => {
    						let i = 0;
    						Array.from(tbody.children).forEach(td => {
    							let th = tr.children[i];
    							let thW = th.getBoundingClientRect().width;
    							let tdW = td.getBoundingClientRect().width;
    							if (tdW > thW) { 
    								th.style.minWidth = tdW + 'px';
    								th.style.maxWidth = tdW + 'px';
    								$columns[i].minWidth = tdW;
    							}
    							else {
    								td.style.minWidth = thW + 'px';
    								td.style.maxWidth = thW + 'px';
    								$columns[i].minWidth = thW;
    							} 
    							i++;
    						});
    					});
    				}, 50);			
    			},
    		}
        }

    	get(id)
    	{
    		return context.get(id).getColumns()
    	}

    	getData(id) 
    	{
    		const columns =  context.get(id).getColumns();
    		return context.get(id).getColumns().get(columns)
    	}
    }

    class Datatable
    {
        constructor(identifier) 
        {
            this.id = identifier;
        }

        create() 
        {
            this.options   = new options().create();
            this.states    = new States().create(this.options, this.id);
            this.filters   = new Filters().create();
            this.data      = new Data().create(this.states, this.filters, this.options);
            this.columns   = new Columns().create(this.data.data, this.states, this.filters, this.options);
            context.add(this);
        }

        get(id)
        {
            return context.get(id)
        }

        getOptions       () { return this?.options                }
        getPageNumber    () { return this?.states.pageNumber      }
        getId            () { return this?.states.id              }
        getRowsCount     () { return this?.states.rowsCount       }
        getDatatableWidth() { return this?.states.datatableWidth  }
        getGlobalFilter  () { return this?.filters.globalFilter   }
        getLocalFilters  () { return this?.filters.localFilters   }
        getData          () { return this?.data.data              }
        getFiltered      () { return this?.data.filtered          }
        getRows          () { return this?.data.rows              }
        getColumns       () { return this?.columns                }

    }

    class Component 
    {
        constructor( id = 'svelte-simple-datatable' )
        {
            this.context = context.get(id);
            this.id = id;
        }
        init() 
        {
            this.setColumns();
            this.resize();
            this.addEventScrollX();
            new ResizeObserver((mutations) => {
                this.resize();
            }).observe(document.querySelector(`#${this.id}`).parentElement);
        }

        reset () 
        {
            this.context.getPageNumber().update(store => 1);
            this.context.getGlobalFilter().remove();
            this.context.getLocalFilters().remove();
            this.context.getColumns().set([]);
        }

        setRows(data)
        {
            for ( const item of data ) {

                for ( const key of Object.keys(item) ) {
                    if (item[key] === null) {
                        item[key] = '';
                    }
                }

            }
            this.context.getData().set(data);
            return
        }

        getSize()
        {
            const parent = document.querySelector(`#${this.id}`).parentNode;
            const style = getComputedStyle(parent);
            const rect = parent.getBoundingClientRect();
            const getNumber = (pxValue) => { return parseFloat(pxValue.replace('px', ''))  }; 
            return {
                parentWidth: rect.width,
                parentHeight: rect.height,
                width: (rect.width - getNumber(style.paddingLeft) - getNumber(style.paddingRight) - getNumber(style.borderLeftWidth) - getNumber(style.borderRightWidth)) / rect.width,
                height: (rect.height - getNumber(style.paddingTop) - getNumber(style.paddingBottom) - getNumber(style.borderTopWidth) - getNumber(style.borderBottomWidth)) / rect.height,
                top: style.paddingTop,
                right: style.paddingRight,
                bottom: style.paddingBottom,
                left: style.paddingLeft
            }
        }

        resize()
        {
            if ( !document.querySelector(`#${this.id}`) ) return
            const size = this.getSize();
            const tableContainer = document.querySelector(`#${this.id} .dt-table`);
            if ( this.getOptions().scrollY ) {
                tableContainer.style.height = this.setTableContainerHeight(size.parentHeight * size.height) + 'px';
                this.context.getColumns().redraw();
            }
            this.context.getDatatableWidth().set( size.parentWidth * size.width );
            if (size.parentWidth * size.width < document.querySelector(`#${this.id} table`).offsetWidth) {
                tableContainer.style.overflowX = 'auto';
            }
        }

        setTableContainerHeight(height) 
        {
            let paginationBlock;
            if (this.getOptions().pagination && (this.getOptions().blocks.paginationButtons || this.getOptions().blocks.paginationRowCount)) {
                paginationBlock = true;
            }
            const calc = [
                (this.getOptions().blocks.searchInput) ? document.querySelector(`#${this.id} .dt-search`).getBoundingClientRect().height : 0,
                (paginationBlock) ? document.querySelector(`#${this.id} .dt-pagination`).getBoundingClientRect().height : 0
            ];
            const sum = (a, b) => a + b;
            document.querySelector(`#${this.id} .dt-table`).style.height = height - calc.reduce(sum) + 'px';
        }

        addEventScrollX()
        {
            if ( this.getOptions().scrollY ) {
                document.querySelector(`#${this.id} .dt-table`).addEventListener('scroll', (e) => {
                    document.querySelector(`#${this.id} .dt-header`).style.left = (-1 * e.target.scrollLeft) + 'px';
                });
            }
        }

        setColumns() {
            setTimeout( () => {
                const columnList = [];
                let i = 0;
                document.querySelectorAll(`#${this.id} table thead th`).forEach(th => {
                    columnList.push({
                        index: i,
                        html: th.innerHTML,
                        key: this.getKey(th.dataset.key),
                        sort: null,
                        classList: th.classList,
                        minWidth: th.getBoundingClientRect().width
                    });
                    th.addEventListener('click', (e) => {
                        this.context.getColumns().sort(e.target, this.getKey(th.dataset.key));
                    }, true);
                    i++;
                });
                this.context.getColumns().set(columnList);
            }, 25);
        }

        getKey(key) 
        {
            if (!key)  return 
            if (key && key.indexOf('=>') > 0) {
                return new Function(`'use strict';return (${key})`)()
            }
            return (x) => x[key]
        }

        getOptions() 
        {
            return this.context.getOptions().get(this.context.getOptions())
        }
    }

    /* node_modules\svelte-simple-datatables\src\Datatable.svelte generated by Svelte v3.54.0 */
    const file$2 = "node_modules\\svelte-simple-datatables\\src\\Datatable.svelte";
    const get_default_slot_changes = dirty => ({});
    const get_default_slot_context = ctx => ({ rows: /*datatable*/ ctx[3].getRows() });

    // (40:1) {#if $options.blocks.searchInput === true}
    function create_if_block_2$1(ctx) {
    	let search;
    	let current;

    	search = new Search({
    			props: {
    				options: /*options*/ ctx[4],
    				id: /*id*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(search.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(search, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const search_changes = {};
    			if (dirty & /*id*/ 2) search_changes.id = /*id*/ ctx[1];
    			search.$set(search_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(search, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(40:1) {#if $options.blocks.searchInput === true}",
    		ctx
    	});

    	return block;
    }

    // (44:2) {#if $options.scrollY}
    function create_if_block_1$1(ctx) {
    	let stickyheader;
    	let current;

    	stickyheader = new StickyHeader({
    			props: {
    				id: /*id*/ ctx[1],
    				options: /*options*/ ctx[4],
    				columns: /*datatable*/ ctx[3].getColumns()
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stickyheader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stickyheader, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stickyheader_changes = {};
    			if (dirty & /*id*/ 2) stickyheader_changes.id = /*id*/ ctx[1];
    			stickyheader.$set(stickyheader_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stickyheader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stickyheader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stickyheader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(44:2) {#if $options.scrollY}",
    		ctx
    	});

    	return block;
    }

    // (51:1) {#if $options.blocks.paginationRowCount === true || $options.blocks.paginationButtons === true}
    function create_if_block$1(ctx) {
    	let pagination;
    	let current;

    	pagination = new Pagination({
    			props: {
    				options: /*options*/ ctx[4],
    				id: /*id*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pagination.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pagination, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pagination_changes = {};
    			if (dirty & /*id*/ 2) pagination_changes.id = /*id*/ ctx[1];
    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pagination, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(51:1) {#if $options.blocks.paginationRowCount === true || $options.blocks.paginationButtons === true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let t0;
    	let article;
    	let t1;
    	let table;
    	let t2;
    	let section_class_value;
    	let current;
    	let if_block0 = /*$options*/ ctx[2].blocks.searchInput === true && create_if_block_2$1(ctx);
    	let if_block1 = /*$options*/ ctx[2].scrollY && create_if_block_1$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context);
    	let if_block2 = (/*$options*/ ctx[2].blocks.paginationRowCount === true || /*$options*/ ctx[2].blocks.paginationButtons === true) && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			article = element("article");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			table = element("table");
    			if (default_slot) default_slot.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(table, "class", "svelte-z0nhq");
    			add_location(table, file$2, 46, 2, 1193);
    			attr_dev(article, "class", "dt-table svelte-z0nhq");
    			add_location(article, file$2, 42, 1, 1060);
    			attr_dev(section, "id", /*id*/ ctx[1]);
    			attr_dev(section, "class", section_class_value = "datatable " + /*classList*/ ctx[0] + " svelte-z0nhq");
    			toggle_class(section, "scroll-y", /*$options*/ ctx[2].scrollY);
    			toggle_class(section, "css", /*$options*/ ctx[2].css);
    			add_location(section, file$2, 33, 0, 860);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t0);
    			append_dev(section, article);
    			if (if_block1) if_block1.m(article, null);
    			append_dev(article, t1);
    			append_dev(article, table);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			append_dev(section, t2);
    			if (if_block2) if_block2.m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$options*/ ctx[2].blocks.searchInput === true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$options*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(section, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$options*/ ctx[2].scrollY) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$options*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(article, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (/*$options*/ ctx[2].blocks.paginationRowCount === true || /*$options*/ ctx[2].blocks.paginationButtons === true) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*$options*/ 4) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(section, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*id*/ 2) {
    				attr_dev(section, "id", /*id*/ ctx[1]);
    			}

    			if (!current || dirty & /*classList*/ 1 && section_class_value !== (section_class_value = "datatable " + /*classList*/ ctx[0] + " svelte-z0nhq")) {
    				attr_dev(section, "class", section_class_value);
    			}

    			if (!current || dirty & /*classList, $options*/ 5) {
    				toggle_class(section, "scroll-y", /*$options*/ ctx[2].scrollY);
    			}

    			if (!current || dirty & /*classList, $options*/ 5) {
    				toggle_class(section, "css", /*$options*/ ctx[2].css);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(default_slot, local);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(default_slot, local);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (default_slot) default_slot.d(detaching);
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $options;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Datatable', slots, ['default']);
    	let { data = [] } = $$props;
    	let { settings = {} } = $$props;
    	let { classList = '' } = $$props;
    	let { id = 'svelte-simple-datatable' } = $$props;

    	//Initialize context for all stores.
    	const datatable = new Datatable(id);

    	datatable.create();
    	const options = datatable.getOptions();
    	validate_store(options, 'options');
    	component_subscribe($$self, options, value => $$invalidate(2, $options = value));
    	const component = new Component(id);
    	const rows = datatable.getRows();
    	const dataRows = rows;
    	onMount(() => component.init());
    	onDestroy(() => component.reset());
    	const writable_props = ['data', 'settings', 'classList', 'id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Datatable> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(5, data = $$props.data);
    		if ('settings' in $$props) $$invalidate(6, settings = $$props.settings);
    		if ('classList' in $$props) $$invalidate(0, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Search,
    		Pagination,
    		StickyHeader,
    		onMount,
    		onDestroy,
    		Datatable,
    		Component,
    		data,
    		settings,
    		classList,
    		id,
    		datatable,
    		options,
    		component,
    		rows,
    		dataRows,
    		$options
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(5, data = $$props.data);
    		if ('settings' in $$props) $$invalidate(6, settings = $$props.settings);
    		if ('classList' in $$props) $$invalidate(0, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data, settings*/ 96) {
    			{
    				component.setRows(data);
    				options.set(options.parse(settings));
    			}
    		}
    	};

    	return [
    		classList,
    		id,
    		$options,
    		datatable,
    		options,
    		data,
    		settings,
    		dataRows,
    		$$scope,
    		slots
    	];
    }

    class Datatable_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			data: 5,
    			settings: 6,
    			classList: 0,
    			id: 1,
    			dataRows: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Datatable_1",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get data() {
    		throw new Error("<Datatable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Datatable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get settings() {
    		throw new Error("<Datatable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Datatable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<Datatable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<Datatable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Datatable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Datatable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRows() {
    		return this.$$.ctx[7];
    	}

    	set dataRows(value) {
    		throw new Error("<Datatable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function parse(s) {
      var ancestors = [];
      var tree = {};
      var tokens = s.split(/\s*(;|\(|\)|,|:)\s*/);
      for (var i=0; i<tokens.length; i++) {
        var token = tokens[i];
        switch (token) {
          case '(': // new branchset
            var subtree = {};
            tree.branchset = [subtree];
            ancestors.push(tree);
            tree = subtree;
            break;
          case ',': // another branch
            var subtree = {};
            ancestors[ancestors.length-1].branchset.push(subtree);
            tree = subtree;
            break;
          case ')': // optional name next
            tree = ancestors.pop();
            break;
          case ':': // optional length next
            break;
          default:
            var x = tokens[i-1];
            if (x == ')' || x == '(' || x == ',') {
              tree.name = token;
            } else if (x == ':') {
              tree.length = parseFloat(token);
            }
        }
      }
      return tree;
    }

    function rightAngleDiagonal () {
      var projection = function(d) { return [d.y, d.x]; };
      
      var path = function(pathData) {
        return "M" + pathData[0] + ' ' + pathData[1] + " " + pathData[2];
      };
      
      function diagonal(diagonalPath, i) {
        var source = diagonalPath.source,
            target = diagonalPath.target;
            (source.x + target.x) / 2;
            (source.y + target.y) / 2;
            var pathData = [source, {x: target.x, y: source.y}, target];
        pathData = pathData.map(projection);
        return path(pathData)
      }
      
      diagonal.projection = function(x) {
        if (!arguments.length) return projection;
        projection = x;
        return diagonal;
      };
      
      diagonal.path = function(x) {
        if (!arguments.length) return path;
        path = x;
        return diagonal;
      };
      
      return diagonal;
    }


    function scaleBranchLengths(nodes, w) {
      // Visit all nodes and adjust y pos width distance metric
      var visitPreOrder = function(root, callback) {
        callback(root);
        if (root.children) {
          for (var i = root.children.length - 1; i >= 0; i--){
            visitPreOrder(root.children[i], callback);
          }    }
      };
      visitPreOrder(nodes[0], function(node) {
        node.rootDist = (node.parent ? node.parent.rootDist : 0) + (node.length || 0);
      });
      var rootDists = nodes.map(function(n) { return n.rootDist; });
      var yscale = d3.scale.linear()
        .domain([0, d3.max(rootDists)])
        .range([0, w]);
      visitPreOrder(nodes[0], function(node) {
        node.y = yscale(node.rootDist);
      });
      return yscale
    }

    function Draw_Phylo(selector, nodes, options) {
      options = options || {};
      let  w = options.width || d3.select(selector).style('width') || d3.select(selector).attr('width');
      let h = options.height || d3.select(selector).style('height') || d3.select(selector).attr('height');
        w = parseInt(w),
        h = parseInt(h);
    let tree = options.tree || d3.layout.cluster()
      .size([h, w])
      .sort(function(node) { return node.children ? node.children.length : -1; })
      .children(options.children || function(node) {
        return node.branchset
      });
    let diagonal = options.diagonal || rightAngleDiagonal();
    let svg =  d3.select(selector).append("svg:svg")
        .attr("width", w + 500)
        .attr("height", h + 30)
      .append("svg:g")
        .attr("transform", "translate(20, 20)");
     nodes = tree(nodes);


    scaleBranchLengths(nodes, w);
            
    svg.append("style").text(`

.link--active {
  stroke: #000 !important;
  stroke-width: 1.5px;
}

.link-extension--active {
  stroke-opacity: .6;
}

.label--active {
  font-weight: bold;
  fill : green;
  font-size : 20px;

}

.label--mark {
  font-weight: normal;
}

.label--highlight {
  font-weight: bold;
  fill : green;
  font-size : 20px;
}

`);

    svg.selectAll("path.link")
    .data(tree.links(nodes))
    .enter().append("svg:path")
    .attr("class", "link")
    .attr("d", diagonal)
    .attr("fill", "none")
    .attr("stroke", "#000000")
    .attr("stroke-width", "0.5px");

    svg.selectAll("g.node")
      .data(nodes)
    .enter().append("svg:g")
      .attr("class", function(n) {
        if (n.children) {
          if (n.depth == 0) {
            return "root node"
          } else {
            return "inner node"
          }
        } else {
          return "leaf node"
        }
      })
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .on("mouseover", mouseovered(true))
      .on("mouseout", mouseovered(false));
      



      svg.selectAll('g.inner.node')
        .append("svg:text")
          .attr("dx", -4)
          .attr("dy", -6)
          .attr("text-anchor", 'end')
          .attr('font-size', '10px')
          .attr('fill', '#000000')
          .text(function(d) { return d.length; });

      svg.selectAll('g.leaf.node').append("svg:text")
        .attr("dx", 8)
        .attr("dy", 3)
        .attr("text-anchor", "start")
        .attr('font-family', 'Helvetica Neue, Helvetica, sans-serif')
        .attr('font-size', '10px')
        .attr('fill', 'black')
        .text(function(d) { return d.name + ' ('+d.length+')'; })
        .attr("my" , select(options.select_element));

    return {svg: svg}
    }

    function mouseovered(active) {
      return function() {   
        d3.select(this).classed("label--active", active);
        /*
        console.log(d3.select(this)._groups[0][0].__data__.name == "BRIDGE_WGS_HOR_1048")
        console.log(d3.selectAll('g.leaf.node')._groups[0])
        console.log(d3.selectAll('g.leaf.node')._groups[0][0].__data__.name == "BRIDGE_WGS_HOR_1048")
        */   
      };
    }

    function select(select_element ,activate) {

      return function() {

        var node = d3.selectAll('g.leaf.node')._groups[0];
        console.log(node.length);

        for (var j=0;j<select_element.length;j++)
        {
          for (var i=0;i<node.length;i++)
          {
                if(node[i].__data__.name == select_element[j]) {
                  console.log("this is my node");
                  node[i].classList.add("label--highlight");
                } 
          }  
        }


    };
    }

    function bind$l(fn, thisArg) {
      return function wrap() {
        return fn.apply(thisArg, arguments);
      };
    }

    // utils is a library of generic helper functions non-specific to axios

    const {toString: toString$i} = Object.prototype;
    const {getPrototypeOf: getPrototypeOf$2} = Object;

    const kindOf = (cache => thing => {
        const str = toString$i.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    })(Object.create(null));

    const kindOfTest = (type) => {
      type = type.toLowerCase();
      return (thing) => kindOf(thing) === type
    };

    const typeOfTest = type => thing => typeof thing === type;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     *
     * @returns {boolean} True if value is an Array, otherwise false
     */
    const {isArray: isArray$5} = Array;

    /**
     * Determine if a value is undefined
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    const isUndefined = typeOfTest('undefined');

    /**
     * Determine if a value is a Buffer
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    const isArrayBuffer = kindOfTest('ArrayBuffer');


    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      let result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a String, otherwise false
     */
    const isString = typeOfTest('string');

    /**
     * Determine if a value is a Function
     *
     * @param {*} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    const isFunction = typeOfTest('function');

    /**
     * Determine if a value is a Number
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Number, otherwise false
     */
    const isNumber$1 = typeOfTest('number');

    /**
     * Determine if a value is an Object
     *
     * @param {*} thing The value to test
     *
     * @returns {boolean} True if value is an Object, otherwise false
     */
    const isObject$l = (thing) => thing !== null && typeof thing === 'object';

    /**
     * Determine if a value is a Boolean
     *
     * @param {*} thing The value to test
     * @returns {boolean} True if value is a Boolean, otherwise false
     */
    const isBoolean = thing => thing === true || thing === false;

    /**
     * Determine if a value is a plain Object
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a plain Object, otherwise false
     */
    const isPlainObject = (val) => {
      if (kindOf(val) !== 'object') {
        return false;
      }

      const prototype = getPrototypeOf$2(val);
      return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
    };

    /**
     * Determine if a value is a Date
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Date, otherwise false
     */
    const isDate = kindOfTest('Date');

    /**
     * Determine if a value is a File
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a File, otherwise false
     */
    const isFile = kindOfTest('File');

    /**
     * Determine if a value is a Blob
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    const isBlob = kindOfTest('Blob');

    /**
     * Determine if a value is a FileList
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a File, otherwise false
     */
    const isFileList = kindOfTest('FileList');

    /**
     * Determine if a value is a Stream
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    const isStream = (val) => isObject$l(val) && isFunction(val.pipe);

    /**
     * Determine if a value is a FormData
     *
     * @param {*} thing The value to test
     *
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    const isFormData = (thing) => {
      const pattern = '[object FormData]';
      return thing && (
        (typeof FormData === 'function' && thing instanceof FormData) ||
        toString$i.call(thing) === pattern ||
        (isFunction(thing.toString) && thing.toString() === pattern)
      );
    };

    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    const isURLSearchParams = kindOfTest('URLSearchParams');

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     *
     * @returns {String} The String freed of excess whitespace
     */
    const trim$2 = (str) => str.trim ?
      str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     *
     * @param {Boolean} [allOwnKeys = false]
     * @returns {any}
     */
    function forEach$2(obj, fn, {allOwnKeys = false} = {}) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      let i;
      let l;

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray$5(obj)) {
        // Iterate over array values
        for (i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        const len = keys.length;
        let key;

        for (i = 0; i < len; i++) {
          key = keys[i];
          fn.call(null, obj[key], key, obj);
        }
      }
    }

    function findKey(obj, key) {
      key = key.toLowerCase();
      const keys = Object.keys(obj);
      let i = keys.length;
      let _key;
      while (i-- > 0) {
        _key = keys[i];
        if (key === _key.toLowerCase()) {
          return _key;
        }
      }
      return null;
    }

    const _global = typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self;

    const isContextDefined = (context) => !isUndefined(context) && context !== _global;

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     *
     * @returns {Object} Result of all merge properties
     */
    function merge$1(/* obj1, obj2, obj3, ... */) {
      const {caseless} = isContextDefined(this) && this || {};
      const result = {};
      const assignValue = (val, key) => {
        const targetKey = caseless && findKey(result, key) || key;
        if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
          result[targetKey] = merge$1(result[targetKey], val);
        } else if (isPlainObject(val)) {
          result[targetKey] = merge$1({}, val);
        } else if (isArray$5(val)) {
          result[targetKey] = val.slice();
        } else {
          result[targetKey] = val;
        }
      };

      for (let i = 0, l = arguments.length; i < l; i++) {
        arguments[i] && forEach$2(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     *
     * @param {Boolean} [allOwnKeys]
     * @returns {Object} The resulting value of object a
     */
    const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
      forEach$2(b, (val, key) => {
        if (thisArg && isFunction(val)) {
          a[key] = bind$l(val, thisArg);
        } else {
          a[key] = val;
        }
      }, {allOwnKeys});
      return a;
    };

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     *
     * @returns {string} content value without BOM
     */
    const stripBOM = (content) => {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    };

    /**
     * Inherit the prototype methods from one constructor into another
     * @param {function} constructor
     * @param {function} superConstructor
     * @param {object} [props]
     * @param {object} [descriptors]
     *
     * @returns {void}
     */
    const inherits = (constructor, superConstructor, props, descriptors) => {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      constructor.prototype.constructor = constructor;
      Object.defineProperty(constructor, 'super', {
        value: superConstructor.prototype
      });
      props && Object.assign(constructor.prototype, props);
    };

    /**
     * Resolve object with deep prototype chain to a flat object
     * @param {Object} sourceObj source object
     * @param {Object} [destObj]
     * @param {Function|Boolean} [filter]
     * @param {Function} [propFilter]
     *
     * @returns {Object}
     */
    const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
      let props;
      let i;
      let prop;
      const merged = {};

      destObj = destObj || {};
      // eslint-disable-next-line no-eq-null,eqeqeq
      if (sourceObj == null) return destObj;

      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = filter !== false && getPrototypeOf$2(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

      return destObj;
    };

    /**
     * Determines whether a string ends with the characters of a specified string
     *
     * @param {String} str
     * @param {String} searchString
     * @param {Number} [position= 0]
     *
     * @returns {boolean}
     */
    const endsWith = (str, searchString, position) => {
      str = String(str);
      if (position === undefined || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      const lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };


    /**
     * Returns new array from array like object or null if failed
     *
     * @param {*} [thing]
     *
     * @returns {?Array}
     */
    const toArray = (thing) => {
      if (!thing) return null;
      if (isArray$5(thing)) return thing;
      let i = thing.length;
      if (!isNumber$1(i)) return null;
      const arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    };

    /**
     * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
     * thing passed in is an instance of Uint8Array
     *
     * @param {TypedArray}
     *
     * @returns {Array}
     */
    // eslint-disable-next-line func-names
    const isTypedArray = (TypedArray => {
      // eslint-disable-next-line func-names
      return thing => {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== 'undefined' && getPrototypeOf$2(Uint8Array));

    /**
     * For each entry in the object, call the function with the key and value.
     *
     * @param {Object<any, any>} obj - The object to iterate over.
     * @param {Function} fn - The function to call for each entry.
     *
     * @returns {void}
     */
    const forEachEntry = (obj, fn) => {
      const generator = obj && obj[Symbol.iterator];

      const iterator = generator.call(obj);

      let result;

      while ((result = iterator.next()) && !result.done) {
        const pair = result.value;
        fn.call(obj, pair[0], pair[1]);
      }
    };

    /**
     * It takes a regular expression and a string, and returns an array of all the matches
     *
     * @param {string} regExp - The regular expression to match against.
     * @param {string} str - The string to search.
     *
     * @returns {Array<boolean>}
     */
    const matchAll = (regExp, str) => {
      let matches;
      const arr = [];

      while ((matches = regExp.exec(str)) !== null) {
        arr.push(matches);
      }

      return arr;
    };

    /* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
    const isHTMLForm = kindOfTest('HTMLFormElement');

    const toCamelCase = str => {
      return str.toLowerCase().replace(/[_-\s]([a-z\d])(\w*)/g,
        function replacer(m, p1, p2) {
          return p1.toUpperCase() + p2;
        }
      );
    };

    /* Creating a function that will check if an object has a property. */
    const hasOwnProperty$1 = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

    /**
     * Determine if a value is a RegExp object
     *
     * @param {*} val The value to test
     *
     * @returns {boolean} True if value is a RegExp object, otherwise false
     */
    const isRegExp$3 = kindOfTest('RegExp');

    const reduceDescriptors = (obj, reducer) => {
      const descriptors = Object.getOwnPropertyDescriptors(obj);
      const reducedDescriptors = {};

      forEach$2(descriptors, (descriptor, name) => {
        if (reducer(descriptor, name, obj) !== false) {
          reducedDescriptors[name] = descriptor;
        }
      });

      Object.defineProperties(obj, reducedDescriptors);
    };

    /**
     * Makes all methods read-only
     * @param {Object} obj
     */

    const freezeMethods = (obj) => {
      reduceDescriptors(obj, (descriptor, name) => {
        // skip restricted props in strict mode
        if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
          return false;
        }

        const value = obj[name];

        if (!isFunction(value)) return;

        descriptor.enumerable = false;

        if ('writable' in descriptor) {
          descriptor.writable = false;
          return;
        }

        if (!descriptor.set) {
          descriptor.set = () => {
            throw Error('Can not rewrite read-only method \'' + name + '\'');
          };
        }
      });
    };

    const toObjectSet = (arrayOrString, delimiter) => {
      const obj = {};

      const define = (arr) => {
        arr.forEach(value => {
          obj[value] = true;
        });
      };

      isArray$5(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

      return obj;
    };

    const noop$2 = () => {};

    const toFiniteNumber = (value, defaultValue) => {
      value = +value;
      return Number.isFinite(value) ? value : defaultValue;
    };

    const toJSONObject = (obj) => {
      const stack = new Array(10);

      const visit = (source, i) => {

        if (isObject$l(source)) {
          if (stack.indexOf(source) >= 0) {
            return;
          }

          if(!('toJSON' in source)) {
            stack[i] = source;
            const target = isArray$5(source) ? [] : {};

            forEach$2(source, (value, key) => {
              const reducedValue = visit(value, i + 1);
              !isUndefined(reducedValue) && (target[key] = reducedValue);
            });

            stack[i] = undefined;

            return target;
          }
        }

        return source;
      };

      return visit(obj, 0);
    };

    var utils = {
      isArray: isArray$5,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString,
      isNumber: isNumber$1,
      isBoolean,
      isObject: isObject$l,
      isPlainObject,
      isUndefined,
      isDate,
      isFile,
      isBlob,
      isRegExp: isRegExp$3,
      isFunction,
      isStream,
      isURLSearchParams,
      isTypedArray,
      isFileList,
      forEach: forEach$2,
      merge: merge$1,
      extend,
      trim: trim$2,
      stripBOM,
      inherits,
      toFlatObject,
      kindOf,
      kindOfTest,
      endsWith,
      toArray,
      forEachEntry,
      matchAll,
      isHTMLForm,
      hasOwnProperty: hasOwnProperty$1,
      hasOwnProp: hasOwnProperty$1, // an alias to avoid ESLint no-prototype-builtins detection
      reduceDescriptors,
      freezeMethods,
      toObjectSet,
      toCamelCase,
      noop: noop$2,
      toFiniteNumber,
      findKey,
      global: _global,
      isContextDefined,
      toJSONObject
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [config] The config.
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     *
     * @returns {Error} The created error.
     */
    function AxiosError(message, code, config, request, response) {
      Error.call(this);

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = (new Error()).stack;
      }

      this.message = message;
      this.name = 'AxiosError';
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      response && (this.response = response);
    }

    utils.inherits(AxiosError, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: utils.toJSONObject(this.config),
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      }
    });

    const prototype$1 = AxiosError.prototype;
    const descriptors$1 = {};

    [
      'ERR_BAD_OPTION_VALUE',
      'ERR_BAD_OPTION',
      'ECONNABORTED',
      'ETIMEDOUT',
      'ERR_NETWORK',
      'ERR_FR_TOO_MANY_REDIRECTS',
      'ERR_DEPRECATED',
      'ERR_BAD_RESPONSE',
      'ERR_BAD_REQUEST',
      'ERR_CANCELED',
      'ERR_NOT_SUPPORT',
      'ERR_INVALID_URL'
    // eslint-disable-next-line func-names
    ].forEach(code => {
      descriptors$1[code] = {value: code};
    });

    Object.defineProperties(AxiosError, descriptors$1);
    Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

    // eslint-disable-next-line func-names
    AxiosError.from = (error, code, config, request, response, customProps) => {
      const axiosError = Object.create(prototype$1);

      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      }, prop => {
        return prop !== 'isAxiosError';
      });

      AxiosError.call(axiosError, error.message, code, config, request, response);

      axiosError.cause = error;

      axiosError.name = error.name;

      customProps && Object.assign(axiosError, customProps);

      return axiosError;
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function getAugmentedNamespace(n) {
      var f = n.default;
    	if (typeof f == "function") {
    		var a = function a () {
    			if (this instanceof a) {
    				var args = [null];
    				args.push.apply(args, arguments);
    				var Ctor = Function.bind.apply(f, args);
    				return new Ctor();
    			}
    			return f.apply(this, arguments);
    		};
    		a.prototype = f.prototype;
      } else a = {};
      Object.defineProperty(a, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    /* eslint-env browser */

    var browser = typeof self == 'object' ? self.FormData : window.FormData;

    var FormData$2 = browser;

    /**
     * Determines if the given thing is a array or js object.
     *
     * @param {string} thing - The object or array to be visited.
     *
     * @returns {boolean}
     */
    function isVisitable(thing) {
      return utils.isPlainObject(thing) || utils.isArray(thing);
    }

    /**
     * It removes the brackets from the end of a string
     *
     * @param {string} key - The key of the parameter.
     *
     * @returns {string} the key without the brackets.
     */
    function removeBrackets(key) {
      return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
    }

    /**
     * It takes a path, a key, and a boolean, and returns a string
     *
     * @param {string} path - The path to the current key.
     * @param {string} key - The key of the current object being iterated over.
     * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
     *
     * @returns {string} The path to the current key.
     */
    function renderKey(path, key, dots) {
      if (!path) return key;
      return path.concat(key).map(function each(token, i) {
        // eslint-disable-next-line no-param-reassign
        token = removeBrackets(token);
        return !dots && i ? '[' + token + ']' : token;
      }).join(dots ? '.' : '');
    }

    /**
     * If the array is an array and none of its elements are visitable, then it's a flat array.
     *
     * @param {Array<any>} arr - The array to check
     *
     * @returns {boolean}
     */
    function isFlatArray(arr) {
      return utils.isArray(arr) && !arr.some(isVisitable);
    }

    const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
      return /^is[A-Z]/.test(prop);
    });

    /**
     * If the thing is a FormData object, return true, otherwise return false.
     *
     * @param {unknown} thing - The thing to check.
     *
     * @returns {boolean}
     */
    function isSpecCompliant(thing) {
      return thing && utils.isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator];
    }

    /**
     * Convert a data object to FormData
     *
     * @param {Object} obj
     * @param {?Object} [formData]
     * @param {?Object} [options]
     * @param {Function} [options.visitor]
     * @param {Boolean} [options.metaTokens = true]
     * @param {Boolean} [options.dots = false]
     * @param {?Boolean} [options.indexes = false]
     *
     * @returns {Object}
     **/

    /**
     * It converts an object into a FormData object
     *
     * @param {Object<any, any>} obj - The object to convert to form data.
     * @param {string} formData - The FormData object to append to.
     * @param {Object<string, any>} options
     *
     * @returns
     */
    function toFormData(obj, formData, options) {
      if (!utils.isObject(obj)) {
        throw new TypeError('target must be an object');
      }

      // eslint-disable-next-line no-param-reassign
      formData = formData || new (FormData$2 || FormData)();

      // eslint-disable-next-line no-param-reassign
      options = utils.toFlatObject(options, {
        metaTokens: true,
        dots: false,
        indexes: false
      }, false, function defined(option, source) {
        // eslint-disable-next-line no-eq-null,eqeqeq
        return !utils.isUndefined(source[option]);
      });

      const metaTokens = options.metaTokens;
      // eslint-disable-next-line no-use-before-define
      const visitor = options.visitor || defaultVisitor;
      const dots = options.dots;
      const indexes = options.indexes;
      const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
      const useBlob = _Blob && isSpecCompliant(formData);

      if (!utils.isFunction(visitor)) {
        throw new TypeError('visitor must be a function');
      }

      function convertValue(value) {
        if (value === null) return '';

        if (utils.isDate(value)) {
          return value.toISOString();
        }

        if (!useBlob && utils.isBlob(value)) {
          throw new AxiosError('Blob is not supported. Use a Buffer instead.');
        }

        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
        }

        return value;
      }

      /**
       * Default visitor.
       *
       * @param {*} value
       * @param {String|Number} key
       * @param {Array<String|Number>} path
       * @this {FormData}
       *
       * @returns {boolean} return true to visit the each prop of the value recursively
       */
      function defaultVisitor(value, key, path) {
        let arr = value;

        if (value && !path && typeof value === 'object') {
          if (utils.endsWith(key, '{}')) {
            // eslint-disable-next-line no-param-reassign
            key = metaTokens ? key : key.slice(0, -2);
            // eslint-disable-next-line no-param-reassign
            value = JSON.stringify(value);
          } else if (
            (utils.isArray(value) && isFlatArray(value)) ||
            (utils.isFileList(value) || utils.endsWith(key, '[]') && (arr = utils.toArray(value))
            )) {
            // eslint-disable-next-line no-param-reassign
            key = removeBrackets(key);

            arr.forEach(function each(el, index) {
              !(utils.isUndefined(el) || el === null) && formData.append(
                // eslint-disable-next-line no-nested-ternary
                indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
                convertValue(el)
              );
            });
            return false;
          }
        }

        if (isVisitable(value)) {
          return true;
        }

        formData.append(renderKey(path, key, dots), convertValue(value));

        return false;
      }

      const stack = [];

      const exposedHelpers = Object.assign(predicates, {
        defaultVisitor,
        convertValue,
        isVisitable
      });

      function build(value, path) {
        if (utils.isUndefined(value)) return;

        if (stack.indexOf(value) !== -1) {
          throw Error('Circular reference detected in ' + path.join('.'));
        }

        stack.push(value);

        utils.forEach(value, function each(el, key) {
          const result = !(utils.isUndefined(el) || el === null) && visitor.call(
            formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
          );

          if (result === true) {
            build(el, path ? path.concat(key) : [key]);
          }
        });

        stack.pop();
      }

      if (!utils.isObject(obj)) {
        throw new TypeError('data must be an object');
      }

      build(obj);

      return formData;
    }

    /**
     * It encodes a string by replacing all characters that are not in the unreserved set with
     * their percent-encoded equivalents
     *
     * @param {string} str - The string to encode.
     *
     * @returns {string} The encoded string.
     */
    function encode$1(str) {
      const charMap = {
        '!': '%21',
        "'": '%27',
        '(': '%28',
        ')': '%29',
        '~': '%7E',
        '%20': '+',
        '%00': '\x00'
      };
      return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
        return charMap[match];
      });
    }

    /**
     * It takes a params object and converts it to a FormData object
     *
     * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
     * @param {Object<string, any>} options - The options object passed to the Axios constructor.
     *
     * @returns {void}
     */
    function AxiosURLSearchParams(params, options) {
      this._pairs = [];

      params && toFormData(params, this, options);
    }

    const prototype = AxiosURLSearchParams.prototype;

    prototype.append = function append(name, value) {
      this._pairs.push([name, value]);
    };

    prototype.toString = function toString(encoder) {
      const _encode = encoder ? function(value) {
        return encoder.call(this, value, encode$1);
      } : encode$1;

      return this._pairs.map(function each(pair) {
        return _encode(pair[0]) + '=' + _encode(pair[1]);
      }, '').join('&');
    };

    /**
     * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
     * URI encoded counterparts
     *
     * @param {string} val The value to be encoded.
     *
     * @returns {string} The encoded value.
     */
    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @param {?object} options
     *
     * @returns {string} The formatted url
     */
    function buildURL(url, params, options) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }
      
      const _encode = options && options.encode || encode;

      const serializeFn = options && options.serialize;

      let serializedParams;

      if (serializeFn) {
        serializedParams = serializeFn(params, options);
      } else {
        serializedParams = utils.isURLSearchParams(params) ?
          params.toString() :
          new AxiosURLSearchParams(params, options).toString(_encode);
      }

      if (serializedParams) {
        const hashmarkIndex = url.indexOf("#");

        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    }

    class InterceptorManager {
      constructor() {
        this.handlers = [];
      }

      /**
       * Add a new interceptor to the stack
       *
       * @param {Function} fulfilled The function to handle `then` for a `Promise`
       * @param {Function} rejected The function to handle `reject` for a `Promise`
       *
       * @return {Number} An ID used to remove interceptor later
       */
      use(fulfilled, rejected, options) {
        this.handlers.push({
          fulfilled,
          rejected,
          synchronous: options ? options.synchronous : false,
          runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
      }

      /**
       * Remove an interceptor from the stack
       *
       * @param {Number} id The ID that was returned by `use`
       *
       * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
       */
      eject(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      }

      /**
       * Clear all interceptors from the stack
       *
       * @returns {void}
       */
      clear() {
        if (this.handlers) {
          this.handlers = [];
        }
      }

      /**
       * Iterate over all the registered interceptors
       *
       * This method is particularly useful for skipping over any
       * interceptors that may have become `null` calling `eject`.
       *
       * @param {Function} fn The function to call for each interceptor
       *
       * @returns {void}
       */
      forEach(fn) {
        utils.forEach(this.handlers, function forEachHandler(h) {
          if (h !== null) {
            fn(h);
          }
        });
      }
    }

    var InterceptorManager$1 = InterceptorManager;

    var transitionalDefaults = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };

    var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

    var FormData$1 = FormData;

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     *
     * @returns {boolean}
     */
    const isStandardBrowserEnv = (() => {
      let product;
      if (typeof navigator !== 'undefined' && (
        (product = navigator.product) === 'ReactNative' ||
        product === 'NativeScript' ||
        product === 'NS')
      ) {
        return false;
      }

      return typeof window !== 'undefined' && typeof document !== 'undefined';
    })();

    /**
     * Determine if we're running in a standard browser webWorker environment
     *
     * Although the `isStandardBrowserEnv` method indicates that
     * `allows axios to run in a web worker`, the WebWorker will still be
     * filtered out due to its judgment standard
     * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
     * This leads to a problem when axios post `FormData` in webWorker
     */
     const isStandardBrowserWebWorkerEnv = (() => {
      return (
        typeof WorkerGlobalScope !== 'undefined' &&
        self instanceof WorkerGlobalScope &&
        typeof self.importScripts === 'function'
      );
    })();


    var platform = {
      isBrowser: true,
      classes: {
        URLSearchParams: URLSearchParams$1,
        FormData: FormData$1,
        Blob
      },
      isStandardBrowserEnv,
      isStandardBrowserWebWorkerEnv,
      protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
    };

    function toURLEncodedForm(data, options) {
      return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
        visitor: function(value, key, path, helpers) {
          if (platform.isNode && utils.isBuffer(value)) {
            this.append(key, value.toString('base64'));
            return false;
          }

          return helpers.defaultVisitor.apply(this, arguments);
        }
      }, options));
    }

    /**
     * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
     *
     * @param {string} name - The name of the property to get.
     *
     * @returns An array of strings.
     */
    function parsePropPath(name) {
      // foo[x][y][z]
      // foo.x.y.z
      // foo-x-y-z
      // foo x y z
      return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
        return match[0] === '[]' ? '' : match[1] || match[0];
      });
    }

    /**
     * Convert an array to an object.
     *
     * @param {Array<any>} arr - The array to convert to an object.
     *
     * @returns An object with the same keys and values as the array.
     */
    function arrayToObject(arr) {
      const obj = {};
      const keys = Object.keys(arr);
      let i;
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        obj[key] = arr[key];
      }
      return obj;
    }

    /**
     * It takes a FormData object and returns a JavaScript object
     *
     * @param {string} formData The FormData object to convert to JSON.
     *
     * @returns {Object<string, any> | null} The converted object.
     */
    function formDataToJSON(formData) {
      function buildPath(path, value, target, index) {
        let name = path[index++];
        const isNumericKey = Number.isFinite(+name);
        const isLast = index >= path.length;
        name = !name && utils.isArray(target) ? target.length : name;

        if (isLast) {
          if (utils.hasOwnProp(target, name)) {
            target[name] = [target[name], value];
          } else {
            target[name] = value;
          }

          return !isNumericKey;
        }

        if (!target[name] || !utils.isObject(target[name])) {
          target[name] = [];
        }

        const result = buildPath(path, value, target[name], index);

        if (result && utils.isArray(target[name])) {
          target[name] = arrayToObject(target[name]);
        }

        return !isNumericKey;
      }

      if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
        const obj = {};

        utils.forEachEntry(formData, (name, value) => {
          buildPath(parsePropPath(name), value, obj, 0);
        });

        return obj;
      }

      return null;
    }

    const DEFAULT_CONTENT_TYPE = {
      'Content-Type': undefined
    };

    /**
     * It takes a string, tries to parse it, and if it fails, it returns the stringified version
     * of the input
     *
     * @param {any} rawValue - The value to be stringified.
     * @param {Function} parser - A function that parses a string into a JavaScript object.
     * @param {Function} encoder - A function that takes a value and returns a string.
     *
     * @returns {string} A stringified version of the rawValue.
     */
    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }

      return (encoder || JSON.stringify)(rawValue);
    }

    const defaults = {

      transitional: transitionalDefaults,

      adapter: ['xhr', 'http'],

      transformRequest: [function transformRequest(data, headers) {
        const contentType = headers.getContentType() || '';
        const hasJSONContentType = contentType.indexOf('application/json') > -1;
        const isObjectPayload = utils.isObject(data);

        if (isObjectPayload && utils.isHTMLForm(data)) {
          data = new FormData(data);
        }

        const isFormData = utils.isFormData(data);

        if (isFormData) {
          if (!hasJSONContentType) {
            return data;
          }
          return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
        }

        if (utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
          return data.toString();
        }

        let isFileList;

        if (isObjectPayload) {
          if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
            return toURLEncodedForm(data, this.formSerializer).toString();
          }

          if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
            const _FormData = this.env && this.env.FormData;

            return toFormData(
              isFileList ? {'files[]': data} : data,
              _FormData && new _FormData(),
              this.formSerializer
            );
          }
        }

        if (isObjectPayload || hasJSONContentType ) {
          headers.setContentType('application/json', false);
          return stringifySafely(data);
        }

        return data;
      }],

      transformResponse: [function transformResponse(data) {
        const transitional = this.transitional || defaults.transitional;
        const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        const JSONRequested = this.responseType === 'json';

        if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
          const silentJSONParsing = transitional && transitional.silentJSONParsing;
          const strictJSONParsing = !silentJSONParsing && JSONRequested;

          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      env: {
        FormData: platform.classes.FormData,
        Blob: platform.classes.Blob
      },

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },

      headers: {
        common: {
          'Accept': 'application/json, text/plain, */*'
        }
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults$1 = defaults;

    // RawAxiosHeaders whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    const ignoreDuplicateOf = utils.toObjectSet([
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ]);

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} rawHeaders Headers needing to be parsed
     *
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = rawHeaders => {
      const parsed = {};
      let key;
      let val;
      let i;

      rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
        i = line.indexOf(':');
        key = line.substring(0, i).trim().toLowerCase();
        val = line.substring(i + 1).trim();

        if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
          return;
        }

        if (key === 'set-cookie') {
          if (parsed[key]) {
            parsed[key].push(val);
          } else {
            parsed[key] = [val];
          }
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      });

      return parsed;
    };

    const $internals = Symbol('internals');

    function normalizeHeader(header) {
      return header && String(header).trim().toLowerCase();
    }

    function normalizeValue(value) {
      if (value === false || value == null) {
        return value;
      }

      return utils.isArray(value) ? value.map(normalizeValue) : String(value);
    }

    function parseTokens(str) {
      const tokens = Object.create(null);
      const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
      let match;

      while ((match = tokensRE.exec(str))) {
        tokens[match[1]] = match[2];
      }

      return tokens;
    }

    function isValidHeaderName(str) {
      return /^[-_a-zA-Z]+$/.test(str.trim());
    }

    function matchHeaderValue(context, value, header, filter) {
      if (utils.isFunction(filter)) {
        return filter.call(this, value, header);
      }

      if (!utils.isString(value)) return;

      if (utils.isString(filter)) {
        return value.indexOf(filter) !== -1;
      }

      if (utils.isRegExp(filter)) {
        return filter.test(value);
      }
    }

    function formatHeader(header) {
      return header.trim()
        .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
          return char.toUpperCase() + str;
        });
    }

    function buildAccessors(obj, header) {
      const accessorName = utils.toCamelCase(' ' + header);

      ['get', 'set', 'has'].forEach(methodName => {
        Object.defineProperty(obj, methodName + accessorName, {
          value: function(arg1, arg2, arg3) {
            return this[methodName].call(this, header, arg1, arg2, arg3);
          },
          configurable: true
        });
      });
    }

    class AxiosHeaders {
      constructor(headers) {
        headers && this.set(headers);
      }

      set(header, valueOrRewrite, rewrite) {
        const self = this;

        function setHeader(_value, _header, _rewrite) {
          const lHeader = normalizeHeader(_header);

          if (!lHeader) {
            throw new Error('header name must be a non-empty string');
          }

          const key = utils.findKey(self, lHeader);

          if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
            self[key || _header] = normalizeValue(_value);
          }
        }

        const setHeaders = (headers, _rewrite) =>
          utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

        if (utils.isPlainObject(header) || header instanceof this.constructor) {
          setHeaders(header, valueOrRewrite);
        } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
          setHeaders(parseHeaders(header), valueOrRewrite);
        } else {
          header != null && setHeader(valueOrRewrite, header, rewrite);
        }

        return this;
      }

      get(header, parser) {
        header = normalizeHeader(header);

        if (header) {
          const key = utils.findKey(this, header);

          if (key) {
            const value = this[key];

            if (!parser) {
              return value;
            }

            if (parser === true) {
              return parseTokens(value);
            }

            if (utils.isFunction(parser)) {
              return parser.call(this, value, key);
            }

            if (utils.isRegExp(parser)) {
              return parser.exec(value);
            }

            throw new TypeError('parser must be boolean|regexp|function');
          }
        }
      }

      has(header, matcher) {
        header = normalizeHeader(header);

        if (header) {
          const key = utils.findKey(this, header);

          return !!(key && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
        }

        return false;
      }

      delete(header, matcher) {
        const self = this;
        let deleted = false;

        function deleteHeader(_header) {
          _header = normalizeHeader(_header);

          if (_header) {
            const key = utils.findKey(self, _header);

            if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
              delete self[key];

              deleted = true;
            }
          }
        }

        if (utils.isArray(header)) {
          header.forEach(deleteHeader);
        } else {
          deleteHeader(header);
        }

        return deleted;
      }

      clear() {
        return Object.keys(this).forEach(this.delete.bind(this));
      }

      normalize(format) {
        const self = this;
        const headers = {};

        utils.forEach(this, (value, header) => {
          const key = utils.findKey(headers, header);

          if (key) {
            self[key] = normalizeValue(value);
            delete self[header];
            return;
          }

          const normalized = format ? formatHeader(header) : String(header).trim();

          if (normalized !== header) {
            delete self[header];
          }

          self[normalized] = normalizeValue(value);

          headers[normalized] = true;
        });

        return this;
      }

      concat(...targets) {
        return this.constructor.concat(this, ...targets);
      }

      toJSON(asStrings) {
        const obj = Object.create(null);

        utils.forEach(this, (value, header) => {
          value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
        });

        return obj;
      }

      [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]();
      }

      toString() {
        return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
      }

      get [Symbol.toStringTag]() {
        return 'AxiosHeaders';
      }

      static from(thing) {
        return thing instanceof this ? thing : new this(thing);
      }

      static concat(first, ...targets) {
        const computed = new this(first);

        targets.forEach((target) => computed.set(target));

        return computed;
      }

      static accessor(header) {
        const internals = this[$internals] = (this[$internals] = {
          accessors: {}
        });

        const accessors = internals.accessors;
        const prototype = this.prototype;

        function defineAccessor(_header) {
          const lHeader = normalizeHeader(_header);

          if (!accessors[lHeader]) {
            buildAccessors(prototype, _header);
            accessors[lHeader] = true;
          }
        }

        utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

        return this;
      }
    }

    AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent']);

    utils.freezeMethods(AxiosHeaders.prototype);
    utils.freezeMethods(AxiosHeaders);

    var AxiosHeaders$1 = AxiosHeaders;

    /**
     * Transform the data for a request or a response
     *
     * @param {Array|Function} fns A single function or Array of functions
     * @param {?Object} response The response object
     *
     * @returns {*} The resulting transformed data
     */
    function transformData(fns, response) {
      const config = this || defaults$1;
      const context = response || config;
      const headers = AxiosHeaders$1.from(context.headers);
      let data = context.data;

      utils.forEach(fns, function transform(fn) {
        data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
      });

      headers.normalize();

      return data;
    }

    function isCancel(value) {
      return !!(value && value.__CANCEL__);
    }

    /**
     * A `CanceledError` is an object that is thrown when an operation is canceled.
     *
     * @param {string=} message The message.
     * @param {Object=} config The config.
     * @param {Object=} request The request.
     *
     * @returns {CanceledError} The created error.
     */
    function CanceledError(message, config, request) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
      this.name = 'CanceledError';
    }

    utils.inherits(CanceledError, AxiosError, {
      __CANCEL__: true
    });

    // eslint-disable-next-line strict
    var httpAdapter = null;

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     *
     * @returns {object} The response.
     */
    function settle(resolve, reject, response) {
      const validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError(
          'Request failed with status code ' + response.status,
          [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    }

    var cookies = platform.isStandardBrowserEnv ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            const cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })();

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     *
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    }

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     *
     * @returns {string} The combined URL
     */
    function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    }

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     *
     * @returns {string} The combined full path
     */
    function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    }

    var isURLSameOrigin = platform.isStandardBrowserEnv ?

    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        const msie = /(msie|trident)/i.test(navigator.userAgent);
        const urlParsingNode = document.createElement('a');
        let originURL;

        /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
        function resolveURL(url) {
          let href = url;

          if (msie) {
            // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname :
              '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
        return function isURLSameOrigin(requestURL) {
          const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host);
        };
      })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })();

    function parseProtocol(url) {
      const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || '';
    }

    /**
     * Calculate data maxRate
     * @param {Number} [samplesCount= 10]
     * @param {Number} [min= 1000]
     * @returns {Function}
     */
    function speedometer(samplesCount, min) {
      samplesCount = samplesCount || 10;
      const bytes = new Array(samplesCount);
      const timestamps = new Array(samplesCount);
      let head = 0;
      let tail = 0;
      let firstSampleTS;

      min = min !== undefined ? min : 1000;

      return function push(chunkLength) {
        const now = Date.now();

        const startedAt = timestamps[tail];

        if (!firstSampleTS) {
          firstSampleTS = now;
        }

        bytes[head] = chunkLength;
        timestamps[head] = now;

        let i = tail;
        let bytesCount = 0;

        while (i !== head) {
          bytesCount += bytes[i++];
          i = i % samplesCount;
        }

        head = (head + 1) % samplesCount;

        if (head === tail) {
          tail = (tail + 1) % samplesCount;
        }

        if (now - firstSampleTS < min) {
          return;
        }

        const passed = startedAt && now - startedAt;

        return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
      };
    }

    function progressEventReducer(listener, isDownloadStream) {
      let bytesNotified = 0;
      const _speedometer = speedometer(50, 250);

      return e => {
        const loaded = e.loaded;
        const total = e.lengthComputable ? e.total : undefined;
        const progressBytes = loaded - bytesNotified;
        const rate = _speedometer(progressBytes);
        const inRange = loaded <= total;

        bytesNotified = loaded;

        const data = {
          loaded,
          total,
          progress: total ? (loaded / total) : undefined,
          bytes: progressBytes,
          rate: rate ? rate : undefined,
          estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
          event: e
        };

        data[isDownloadStream ? 'download' : 'upload'] = true;

        listener(data);
      };
    }

    const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

    var xhrAdapter = isXHRAdapterSupported && function (config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        let requestData = config.data;
        const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
        const responseType = config.responseType;
        let onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }

          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }

        if (utils.isFormData(requestData) && (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv)) {
          requestHeaders.setContentType(false); // Let the browser set it
        }

        let request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          const username = config.auth.username || '';
          const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
        }

        const fullPath = buildFullPath(config.baseURL, config.url);

        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        function onloadend() {
          if (!request) {
            return;
          }
          // Prepare the response
          const responseHeaders = AxiosHeaders$1.from(
            'getAllResponseHeaders' in request && request.getAllResponseHeaders()
          );
          const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
            request.responseText : request.response;
          const response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          };

          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);

          // Clean up request
          request = null;
        }

        if ('onloadend' in request) {
          // Use onloadend if available
          request.onloadend = onloadend;
        } else {
          // Listen for ready state to emulate onloadend
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
          };
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
          const transitional = config.transitional || transitionalDefaults;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError(
            timeoutErrorMessage,
            transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
            config,
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (platform.isStandardBrowserEnv) {
          // Add xsrf header
          const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
            && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

          if (xsrfValue) {
            requestHeaders.set(config.xsrfHeaderName, xsrfValue);
          }
        }

        // Remove Content-Type if data is undefined
        requestData === undefined && requestHeaders.setContentType(null);

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
            request.setRequestHeader(key, val);
          });
        }

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
        }

        if (config.cancelToken || config.signal) {
          // Handle cancellation
          // eslint-disable-next-line func-names
          onCanceled = cancel => {
            if (!request) {
              return;
            }
            reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
            request.abort();
            request = null;
          };

          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
          }
        }

        const protocol = parseProtocol(fullPath);

        if (protocol && platform.protocols.indexOf(protocol) === -1) {
          reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
          return;
        }


        // Send the request
        request.send(requestData || null);
      });
    };

    const knownAdapters = {
      http: httpAdapter,
      xhr: xhrAdapter
    };

    utils.forEach(knownAdapters, (fn, value) => {
      if(fn) {
        try {
          Object.defineProperty(fn, 'name', {value});
        } catch (e) {
          // eslint-disable-next-line no-empty
        }
        Object.defineProperty(fn, 'adapterName', {value});
      }
    });

    var adapters = {
      getAdapter: (adapters) => {
        adapters = utils.isArray(adapters) ? adapters : [adapters];

        const {length} = adapters;
        let nameOrAdapter;
        let adapter;

        for (let i = 0; i < length; i++) {
          nameOrAdapter = adapters[i];
          if((adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
            break;
          }
        }

        if (!adapter) {
          if (adapter === false) {
            throw new AxiosError(
              `Adapter ${nameOrAdapter} is not supported by the environment`,
              'ERR_NOT_SUPPORT'
            );
          }

          throw new Error(
            utils.hasOwnProp(knownAdapters, nameOrAdapter) ?
              `Adapter '${nameOrAdapter}' is not available in the build` :
              `Unknown adapter '${nameOrAdapter}'`
          );
        }

        if (!utils.isFunction(adapter)) {
          throw new TypeError('adapter is not a function');
        }

        return adapter;
      },
      adapters: knownAdapters
    };

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     *
     * @param {Object} config The config that is to be used for the request
     *
     * @returns {void}
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }

      if (config.signal && config.signal.aborted) {
        throw new CanceledError(null, config);
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      config.headers = AxiosHeaders$1.from(config.headers);

      // Transform request data
      config.data = transformData.call(
        config,
        config.transformRequest
      );

      if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
        config.headers.setContentType('application/x-www-form-urlencoded', false);
      }

      const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData.call(
          config,
          config.transformResponse,
          response
        );

        response.headers = AxiosHeaders$1.from(response.headers);

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              config.transformResponse,
              reason.response
            );
            reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
          }
        }

        return Promise.reject(reason);
      });
    }

    const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     *
     * @returns {Object} New object resulting from merging config2 to config1
     */
    function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      const config = {};

      function getMergedValue(target, source, caseless) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge.call({caseless}, target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      // eslint-disable-next-line consistent-return
      function mergeDeepProperties(a, b, caseless) {
        if (!utils.isUndefined(b)) {
          return getMergedValue(a, b, caseless);
        } else if (!utils.isUndefined(a)) {
          return getMergedValue(undefined, a, caseless);
        }
      }

      // eslint-disable-next-line consistent-return
      function valueFromConfig2(a, b) {
        if (!utils.isUndefined(b)) {
          return getMergedValue(undefined, b);
        }
      }

      // eslint-disable-next-line consistent-return
      function defaultToConfig2(a, b) {
        if (!utils.isUndefined(b)) {
          return getMergedValue(undefined, b);
        } else if (!utils.isUndefined(a)) {
          return getMergedValue(undefined, a);
        }
      }

      // eslint-disable-next-line consistent-return
      function mergeDirectKeys(a, b, prop) {
        if (prop in config2) {
          return getMergedValue(a, b);
        } else if (prop in config1) {
          return getMergedValue(undefined, a);
        }
      }

      const mergeMap = {
        url: valueFromConfig2,
        method: valueFromConfig2,
        data: valueFromConfig2,
        baseURL: defaultToConfig2,
        transformRequest: defaultToConfig2,
        transformResponse: defaultToConfig2,
        paramsSerializer: defaultToConfig2,
        timeout: defaultToConfig2,
        timeoutMessage: defaultToConfig2,
        withCredentials: defaultToConfig2,
        adapter: defaultToConfig2,
        responseType: defaultToConfig2,
        xsrfCookieName: defaultToConfig2,
        xsrfHeaderName: defaultToConfig2,
        onUploadProgress: defaultToConfig2,
        onDownloadProgress: defaultToConfig2,
        decompress: defaultToConfig2,
        maxContentLength: defaultToConfig2,
        maxBodyLength: defaultToConfig2,
        beforeRedirect: defaultToConfig2,
        transport: defaultToConfig2,
        httpAgent: defaultToConfig2,
        httpsAgent: defaultToConfig2,
        cancelToken: defaultToConfig2,
        socketPath: defaultToConfig2,
        responseEncoding: defaultToConfig2,
        validateStatus: mergeDirectKeys,
        headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
      };

      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        const merge = mergeMap[prop] || mergeDeepProperties;
        const configValue = merge(config1[prop], config2[prop], prop);
        (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
      });

      return config;
    }

    const VERSION = "1.2.1";

    const validators$1 = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
      validators$1[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
      };
    });

    const deprecatedWarnings = {};

    /**
     * Transitional option validator
     *
     * @param {function|boolean?} validator - set to false if the transitional option has been removed
     * @param {string?} version - deprecated version / removed since version
     * @param {string?} message - some message with additional info
     *
     * @returns {function}
     */
    validators$1.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
      }

      // eslint-disable-next-line func-names
      return (value, opt, opts) => {
        if (validator === false) {
          throw new AxiosError(
            formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
            AxiosError.ERR_DEPRECATED
          );
        }

        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          // eslint-disable-next-line no-console
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' + version + ' and will be removed in the near future'
            )
          );
        }

        return validator ? validator(value, opt, opts) : true;
      };
    };

    /**
     * Assert object's properties type
     *
     * @param {object} options
     * @param {object} schema
     * @param {boolean?} allowUnknown
     *
     * @returns {object}
     */

    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
      }
      const keys = Object.keys(options);
      let i = keys.length;
      while (i-- > 0) {
        const opt = keys[i];
        const validator = schema[opt];
        if (validator) {
          const value = options[opt];
          const result = value === undefined || validator(value, opt, options);
          if (result !== true) {
            throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
        }
      }
    }

    var validator = {
      assertOptions,
      validators: validators$1
    };

    const validators = validator.validators;

    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     *
     * @return {Axios} A new instance of Axios
     */
    class Axios {
      constructor(instanceConfig) {
        this.defaults = instanceConfig;
        this.interceptors = {
          request: new InterceptorManager$1(),
          response: new InterceptorManager$1()
        };
      }

      /**
       * Dispatch a request
       *
       * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
       * @param {?Object} config
       *
       * @returns {Promise} The Promise to be fulfilled
       */
      request(configOrUrl, config) {
        /*eslint no-param-reassign:0*/
        // Allow for axios('example/url'[, config]) a la fetch API
        if (typeof configOrUrl === 'string') {
          config = config || {};
          config.url = configOrUrl;
        } else {
          config = configOrUrl || {};
        }

        config = mergeConfig(this.defaults, config);

        const {transitional, paramsSerializer, headers} = config;

        if (transitional !== undefined) {
          validator.assertOptions(transitional, {
            silentJSONParsing: validators.transitional(validators.boolean),
            forcedJSONParsing: validators.transitional(validators.boolean),
            clarifyTimeoutError: validators.transitional(validators.boolean)
          }, false);
        }

        if (paramsSerializer !== undefined) {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }

        // Set config.method
        config.method = (config.method || this.defaults.method || 'get').toLowerCase();

        let contextHeaders;

        // Flatten headers
        contextHeaders = headers && utils.merge(
          headers.common,
          headers[config.method]
        );

        contextHeaders && utils.forEach(
          ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
          (method) => {
            delete headers[method];
          }
        );

        config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

        // filter out skipped interceptors
        const requestInterceptorChain = [];
        let synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
          if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
            return;
          }

          synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

          requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });

        const responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
          responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });

        let promise;
        let i = 0;
        let len;

        if (!synchronousRequestInterceptors) {
          const chain = [dispatchRequest.bind(this), undefined];
          chain.unshift.apply(chain, requestInterceptorChain);
          chain.push.apply(chain, responseInterceptorChain);
          len = chain.length;

          promise = Promise.resolve(config);

          while (i < len) {
            promise = promise.then(chain[i++], chain[i++]);
          }

          return promise;
        }

        len = requestInterceptorChain.length;

        let newConfig = config;

        i = 0;

        while (i < len) {
          const onFulfilled = requestInterceptorChain[i++];
          const onRejected = requestInterceptorChain[i++];
          try {
            newConfig = onFulfilled(newConfig);
          } catch (error) {
            onRejected.call(this, error);
            break;
          }
        }

        try {
          promise = dispatchRequest.call(this, newConfig);
        } catch (error) {
          return Promise.reject(error);
        }

        i = 0;
        len = responseInterceptorChain.length;

        while (i < len) {
          promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
        }

        return promise;
      }

      getUri(config) {
        config = mergeConfig(this.defaults, config);
        const fullPath = buildFullPath(config.baseURL, config.url);
        return buildURL(fullPath, config.params, config.paramsSerializer);
      }
    }

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/

      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method,
            headers: isForm ? {
              'Content-Type': 'multipart/form-data'
            } : {},
            url,
            data
          }));
        };
      }

      Axios.prototype[method] = generateHTTPMethod();

      Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
    });

    var Axios$1 = Axios;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @param {Function} executor The executor function.
     *
     * @returns {CancelToken}
     */
    class CancelToken {
      constructor(executor) {
        if (typeof executor !== 'function') {
          throw new TypeError('executor must be a function.');
        }

        let resolvePromise;

        this.promise = new Promise(function promiseExecutor(resolve) {
          resolvePromise = resolve;
        });

        const token = this;

        // eslint-disable-next-line func-names
        this.promise.then(cancel => {
          if (!token._listeners) return;

          let i = token._listeners.length;

          while (i-- > 0) {
            token._listeners[i](cancel);
          }
          token._listeners = null;
        });

        // eslint-disable-next-line func-names
        this.promise.then = onfulfilled => {
          let _resolve;
          // eslint-disable-next-line func-names
          const promise = new Promise(resolve => {
            token.subscribe(resolve);
            _resolve = resolve;
          }).then(onfulfilled);

          promise.cancel = function reject() {
            token.unsubscribe(_resolve);
          };

          return promise;
        };

        executor(function cancel(message, config, request) {
          if (token.reason) {
            // Cancellation has already been requested
            return;
          }

          token.reason = new CanceledError(message, config, request);
          resolvePromise(token.reason);
        });
      }

      /**
       * Throws a `CanceledError` if cancellation has been requested.
       */
      throwIfRequested() {
        if (this.reason) {
          throw this.reason;
        }
      }

      /**
       * Subscribe to the cancel signal
       */

      subscribe(listener) {
        if (this.reason) {
          listener(this.reason);
          return;
        }

        if (this._listeners) {
          this._listeners.push(listener);
        } else {
          this._listeners = [listener];
        }
      }

      /**
       * Unsubscribe from the cancel signal
       */

      unsubscribe(listener) {
        if (!this._listeners) {
          return;
        }
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
          this._listeners.splice(index, 1);
        }
      }

      /**
       * Returns an object that contains a new `CancelToken` and a function that, when called,
       * cancels the `CancelToken`.
       */
      static source() {
        let cancel;
        const token = new CancelToken(function executor(c) {
          cancel = c;
        });
        return {
          token,
          cancel
        };
      }
    }

    var CancelToken$1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     *
     * @returns {Function}
     */
    function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    }

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     *
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    function isAxiosError(payload) {
      return utils.isObject(payload) && (payload.isAxiosError === true);
    }

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     *
     * @returns {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      const context = new Axios$1(defaultConfig);
      const instance = bind$l(Axios$1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

      // Copy context to instance
      utils.extend(instance, context, null, {allOwnKeys: true});

      // Factory for creating new instances
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };

      return instance;
    }

    // Create the default instance to be exported
    const axios = createInstance(defaults$1);

    // Expose Axios class to allow class inheritance
    axios.Axios = Axios$1;

    // Expose Cancel & CancelToken
    axios.CanceledError = CanceledError;
    axios.CancelToken = CancelToken$1;
    axios.isCancel = isCancel;
    axios.VERSION = VERSION;
    axios.toFormData = toFormData;

    // Expose AxiosError class
    axios.AxiosError = AxiosError;

    // alias for CanceledError for backward compatibility
    axios.Cancel = axios.CanceledError;

    // Expose all/spread
    axios.all = function all(promises) {
      return Promise.all(promises);
    };

    axios.spread = spread;

    // Expose isAxiosError
    axios.isAxiosError = isAxiosError;

    // Expose mergeConfig
    axios.mergeConfig = mergeConfig;

    axios.AxiosHeaders = AxiosHeaders$1;

    axios.formToJSON = thing => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

    axios.default = axios;

    // this module should only have a default export
    var axios$1 = axios;

    var lib = {};

    var check = function (it) {
      return it && it.Math == Math && it;
    };

    // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
    var global$u =
      // eslint-disable-next-line es/no-global-this -- safe
      check(typeof globalThis == 'object' && globalThis) ||
      check(typeof window == 'object' && window) ||
      // eslint-disable-next-line no-restricted-globals -- safe
      check(typeof self == 'object' && self) ||
      check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
      // eslint-disable-next-line no-new-func -- fallback
      (function () { return this; })() || Function('return this')();

    var objectGetOwnPropertyDescriptor = {};

    var fails$G = function (exec) {
      try {
        return !!exec();
      } catch (error) {
        return true;
      }
    };

    var fails$F = fails$G;

    // Detect IE8's incomplete defineProperty implementation
    var descriptors = !fails$F(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
    });

    var fails$E = fails$G;

    var functionBindNative = !fails$E(function () {
      // eslint-disable-next-line es/no-function-prototype-bind -- safe
      var test = (function () { /* empty */ }).bind();
      // eslint-disable-next-line no-prototype-builtins -- safe
      return typeof test != 'function' || test.hasOwnProperty('prototype');
    });

    var NATIVE_BIND$4 = functionBindNative;

    var call$F = Function.prototype.call;

    var functionCall = NATIVE_BIND$4 ? call$F.bind(call$F) : function () {
      return call$F.apply(call$F, arguments);
    };

    var objectPropertyIsEnumerable = {};

    var $propertyIsEnumerable$2 = {}.propertyIsEnumerable;
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var getOwnPropertyDescriptor$3 = Object.getOwnPropertyDescriptor;

    // Nashorn ~ JDK8 bug
    var NASHORN_BUG = getOwnPropertyDescriptor$3 && !$propertyIsEnumerable$2.call({ 1: 2 }, 1);

    // `Object.prototype.propertyIsEnumerable` method implementation
    // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
    objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
      var descriptor = getOwnPropertyDescriptor$3(this, V);
      return !!descriptor && descriptor.enumerable;
    } : $propertyIsEnumerable$2;

    var createPropertyDescriptor$5 = function (bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value: value
      };
    };

    var NATIVE_BIND$3 = functionBindNative;

    var FunctionPrototype$3 = Function.prototype;
    var call$E = FunctionPrototype$3.call;
    var uncurryThisWithBind = NATIVE_BIND$3 && FunctionPrototype$3.bind.bind(call$E, call$E);

    var functionUncurryThis = NATIVE_BIND$3 ? uncurryThisWithBind : function (fn) {
      return function () {
        return call$E.apply(fn, arguments);
      };
    };

    var uncurryThis$D = functionUncurryThis;

    var toString$h = uncurryThis$D({}.toString);
    var stringSlice$7 = uncurryThis$D(''.slice);

    var classofRaw$2 = function (it) {
      return stringSlice$7(toString$h(it), 8, -1);
    };

    var uncurryThis$C = functionUncurryThis;
    var fails$D = fails$G;
    var classof$b = classofRaw$2;

    var $Object$4 = Object;
    var split = uncurryThis$C(''.split);

    // fallback for non-array-like ES3 and non-enumerable old V8 strings
    var indexedObject = fails$D(function () {
      // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
      // eslint-disable-next-line no-prototype-builtins -- safe
      return !$Object$4('z').propertyIsEnumerable(0);
    }) ? function (it) {
      return classof$b(it) == 'String' ? split(it, '') : $Object$4(it);
    } : $Object$4;

    // we can't use just `it == null` since of `document.all` special case
    // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
    var isNullOrUndefined$9 = function (it) {
      return it === null || it === undefined;
    };

    var isNullOrUndefined$8 = isNullOrUndefined$9;

    var $TypeError$k = TypeError;

    // `RequireObjectCoercible` abstract operation
    // https://tc39.es/ecma262/#sec-requireobjectcoercible
    var requireObjectCoercible$8 = function (it) {
      if (isNullOrUndefined$8(it)) throw $TypeError$k("Can't call method on " + it);
      return it;
    };

    // toObject with fallback for non-array-like ES3 strings
    var IndexedObject$4 = indexedObject;
    var requireObjectCoercible$7 = requireObjectCoercible$8;

    var toIndexedObject$c = function (it) {
      return IndexedObject$4(requireObjectCoercible$7(it));
    };

    var documentAll$2 = typeof document == 'object' && document.all;

    // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
    var IS_HTMLDDA = typeof documentAll$2 == 'undefined' && documentAll$2 !== undefined;

    var documentAll_1 = {
      all: documentAll$2,
      IS_HTMLDDA: IS_HTMLDDA
    };

    var $documentAll$1 = documentAll_1;

    var documentAll$1 = $documentAll$1.all;

    // `IsCallable` abstract operation
    // https://tc39.es/ecma262/#sec-iscallable
    var isCallable$r = $documentAll$1.IS_HTMLDDA ? function (argument) {
      return typeof argument == 'function' || argument === documentAll$1;
    } : function (argument) {
      return typeof argument == 'function';
    };

    var isCallable$q = isCallable$r;
    var $documentAll = documentAll_1;

    var documentAll = $documentAll.all;

    var isObject$k = $documentAll.IS_HTMLDDA ? function (it) {
      return typeof it == 'object' ? it !== null : isCallable$q(it) || it === documentAll;
    } : function (it) {
      return typeof it == 'object' ? it !== null : isCallable$q(it);
    };

    var global$t = global$u;
    var isCallable$p = isCallable$r;

    var aFunction = function (argument) {
      return isCallable$p(argument) ? argument : undefined;
    };

    var getBuiltIn$m = function (namespace, method) {
      return arguments.length < 2 ? aFunction(global$t[namespace]) : global$t[namespace] && global$t[namespace][method];
    };

    var uncurryThis$B = functionUncurryThis;

    var objectIsPrototypeOf = uncurryThis$B({}.isPrototypeOf);

    var getBuiltIn$l = getBuiltIn$m;

    var engineUserAgent = getBuiltIn$l('navigator', 'userAgent') || '';

    var global$s = global$u;
    var userAgent$5 = engineUserAgent;

    var process$3 = global$s.process;
    var Deno$1 = global$s.Deno;
    var versions = process$3 && process$3.versions || Deno$1 && Deno$1.version;
    var v8 = versions && versions.v8;
    var match$1, version;

    if (v8) {
      match$1 = v8.split('.');
      // in old Chrome, versions of V8 isn't V8 = Chrome / 10
      // but their correct versions are not interesting for us
      version = match$1[0] > 0 && match$1[0] < 4 ? 1 : +(match$1[0] + match$1[1]);
    }

    // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
    // so check `userAgent` even if `.v8` exists, but 0
    if (!version && userAgent$5) {
      match$1 = userAgent$5.match(/Edge\/(\d+)/);
      if (!match$1 || match$1[1] >= 74) {
        match$1 = userAgent$5.match(/Chrome\/(\d+)/);
        if (match$1) version = +match$1[1];
      }
    }

    var engineV8Version = version;

    /* eslint-disable es/no-symbol -- required for testing */

    var V8_VERSION$3 = engineV8Version;
    var fails$C = fails$G;

    // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
    var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$C(function () {
      var symbol = Symbol();
      // Chrome 38 Symbol has incorrect toString conversion
      // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
      return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
        // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
        !Symbol.sham && V8_VERSION$3 && V8_VERSION$3 < 41;
    });

    /* eslint-disable es/no-symbol -- required for testing */

    var NATIVE_SYMBOL$6 = symbolConstructorDetection;

    var useSymbolAsUid = NATIVE_SYMBOL$6
      && !Symbol.sham
      && typeof Symbol.iterator == 'symbol';

    var getBuiltIn$k = getBuiltIn$m;
    var isCallable$o = isCallable$r;
    var isPrototypeOf$7 = objectIsPrototypeOf;
    var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

    var $Object$3 = Object;

    var isSymbol$5 = USE_SYMBOL_AS_UID$1 ? function (it) {
      return typeof it == 'symbol';
    } : function (it) {
      var $Symbol = getBuiltIn$k('Symbol');
      return isCallable$o($Symbol) && isPrototypeOf$7($Symbol.prototype, $Object$3(it));
    };

    var $String$3 = String;

    var tryToString$6 = function (argument) {
      try {
        return $String$3(argument);
      } catch (error) {
        return 'Object';
      }
    };

    var isCallable$n = isCallable$r;
    var tryToString$5 = tryToString$6;

    var $TypeError$j = TypeError;

    // `Assert: IsCallable(argument) is true`
    var aCallable$s = function (argument) {
      if (isCallable$n(argument)) return argument;
      throw $TypeError$j(tryToString$5(argument) + ' is not a function');
    };

    var aCallable$r = aCallable$s;
    var isNullOrUndefined$7 = isNullOrUndefined$9;

    // `GetMethod` abstract operation
    // https://tc39.es/ecma262/#sec-getmethod
    var getMethod$6 = function (V, P) {
      var func = V[P];
      return isNullOrUndefined$7(func) ? undefined : aCallable$r(func);
    };

    var call$D = functionCall;
    var isCallable$m = isCallable$r;
    var isObject$j = isObject$k;

    var $TypeError$i = TypeError;

    // `OrdinaryToPrimitive` abstract operation
    // https://tc39.es/ecma262/#sec-ordinarytoprimitive
    var ordinaryToPrimitive$1 = function (input, pref) {
      var fn, val;
      if (pref === 'string' && isCallable$m(fn = input.toString) && !isObject$j(val = call$D(fn, input))) return val;
      if (isCallable$m(fn = input.valueOf) && !isObject$j(val = call$D(fn, input))) return val;
      if (pref !== 'string' && isCallable$m(fn = input.toString) && !isObject$j(val = call$D(fn, input))) return val;
      throw $TypeError$i("Can't convert object to primitive value");
    };

    var shared$7 = {exports: {}};

    var global$r = global$u;

    // eslint-disable-next-line es/no-object-defineproperty -- safe
    var defineProperty$c = Object.defineProperty;

    var defineGlobalProperty$3 = function (key, value) {
      try {
        defineProperty$c(global$r, key, { value: value, configurable: true, writable: true });
      } catch (error) {
        global$r[key] = value;
      } return value;
    };

    var global$q = global$u;
    var defineGlobalProperty$2 = defineGlobalProperty$3;

    var SHARED = '__core-js_shared__';
    var store$3 = global$q[SHARED] || defineGlobalProperty$2(SHARED, {});

    var sharedStore = store$3;

    var store$2 = sharedStore;

    (shared$7.exports = function (key, value) {
      return store$2[key] || (store$2[key] = value !== undefined ? value : {});
    })('versions', []).push({
      version: '3.26.1',
      mode: 'global',
      copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
      license: 'https://github.com/zloirock/core-js/blob/v3.26.1/LICENSE',
      source: 'https://github.com/zloirock/core-js'
    });

    var requireObjectCoercible$6 = requireObjectCoercible$8;

    var $Object$2 = Object;

    // `ToObject` abstract operation
    // https://tc39.es/ecma262/#sec-toobject
    var toObject$d = function (argument) {
      return $Object$2(requireObjectCoercible$6(argument));
    };

    var uncurryThis$A = functionUncurryThis;
    var toObject$c = toObject$d;

    var hasOwnProperty = uncurryThis$A({}.hasOwnProperty);

    // `HasOwnProperty` abstract operation
    // https://tc39.es/ecma262/#sec-hasownproperty
    // eslint-disable-next-line es/no-object-hasown -- safe
    var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
      return hasOwnProperty(toObject$c(it), key);
    };

    var uncurryThis$z = functionUncurryThis;

    var id$1 = 0;
    var postfix = Math.random();
    var toString$g = uncurryThis$z(1.0.toString);

    var uid$4 = function (key) {
      return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$g(++id$1 + postfix, 36);
    };

    var global$p = global$u;
    var shared$6 = shared$7.exports;
    var hasOwn$j = hasOwnProperty_1;
    var uid$3 = uid$4;
    var NATIVE_SYMBOL$5 = symbolConstructorDetection;
    var USE_SYMBOL_AS_UID = useSymbolAsUid;

    var WellKnownSymbolsStore$1 = shared$6('wks');
    var Symbol$2 = global$p.Symbol;
    var symbolFor = Symbol$2 && Symbol$2['for'];
    var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$2 : Symbol$2 && Symbol$2.withoutSetter || uid$3;

    var wellKnownSymbol$q = function (name) {
      if (!hasOwn$j(WellKnownSymbolsStore$1, name) || !(NATIVE_SYMBOL$5 || typeof WellKnownSymbolsStore$1[name] == 'string')) {
        var description = 'Symbol.' + name;
        if (NATIVE_SYMBOL$5 && hasOwn$j(Symbol$2, name)) {
          WellKnownSymbolsStore$1[name] = Symbol$2[name];
        } else if (USE_SYMBOL_AS_UID && symbolFor) {
          WellKnownSymbolsStore$1[name] = symbolFor(description);
        } else {
          WellKnownSymbolsStore$1[name] = createWellKnownSymbol(description);
        }
      } return WellKnownSymbolsStore$1[name];
    };

    var call$C = functionCall;
    var isObject$i = isObject$k;
    var isSymbol$4 = isSymbol$5;
    var getMethod$5 = getMethod$6;
    var ordinaryToPrimitive = ordinaryToPrimitive$1;
    var wellKnownSymbol$p = wellKnownSymbol$q;

    var $TypeError$h = TypeError;
    var TO_PRIMITIVE = wellKnownSymbol$p('toPrimitive');

    // `ToPrimitive` abstract operation
    // https://tc39.es/ecma262/#sec-toprimitive
    var toPrimitive$3 = function (input, pref) {
      if (!isObject$i(input) || isSymbol$4(input)) return input;
      var exoticToPrim = getMethod$5(input, TO_PRIMITIVE);
      var result;
      if (exoticToPrim) {
        if (pref === undefined) pref = 'default';
        result = call$C(exoticToPrim, input, pref);
        if (!isObject$i(result) || isSymbol$4(result)) return result;
        throw $TypeError$h("Can't convert object to primitive value");
      }
      if (pref === undefined) pref = 'number';
      return ordinaryToPrimitive(input, pref);
    };

    var toPrimitive$2 = toPrimitive$3;
    var isSymbol$3 = isSymbol$5;

    // `ToPropertyKey` abstract operation
    // https://tc39.es/ecma262/#sec-topropertykey
    var toPropertyKey$4 = function (argument) {
      var key = toPrimitive$2(argument, 'string');
      return isSymbol$3(key) ? key : key + '';
    };

    var global$o = global$u;
    var isObject$h = isObject$k;

    var document$3 = global$o.document;
    // typeof document.createElement is 'object' in old IE
    var EXISTS$1 = isObject$h(document$3) && isObject$h(document$3.createElement);

    var documentCreateElement$2 = function (it) {
      return EXISTS$1 ? document$3.createElement(it) : {};
    };

    var DESCRIPTORS$j = descriptors;
    var fails$B = fails$G;
    var createElement$1 = documentCreateElement$2;

    // Thanks to IE8 for its funny defineProperty
    var ie8DomDefine = !DESCRIPTORS$j && !fails$B(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty(createElement$1('div'), 'a', {
        get: function () { return 7; }
      }).a != 7;
    });

    var DESCRIPTORS$i = descriptors;
    var call$B = functionCall;
    var propertyIsEnumerableModule$2 = objectPropertyIsEnumerable;
    var createPropertyDescriptor$4 = createPropertyDescriptor$5;
    var toIndexedObject$b = toIndexedObject$c;
    var toPropertyKey$3 = toPropertyKey$4;
    var hasOwn$i = hasOwnProperty_1;
    var IE8_DOM_DEFINE$1 = ie8DomDefine;

    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var $getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
    objectGetOwnPropertyDescriptor.f = DESCRIPTORS$i ? $getOwnPropertyDescriptor$2 : function getOwnPropertyDescriptor(O, P) {
      O = toIndexedObject$b(O);
      P = toPropertyKey$3(P);
      if (IE8_DOM_DEFINE$1) try {
        return $getOwnPropertyDescriptor$2(O, P);
      } catch (error) { /* empty */ }
      if (hasOwn$i(O, P)) return createPropertyDescriptor$4(!call$B(propertyIsEnumerableModule$2.f, O, P), O[P]);
    };

    var objectDefineProperty = {};

    var DESCRIPTORS$h = descriptors;
    var fails$A = fails$G;

    // V8 ~ Chrome 36-
    // https://bugs.chromium.org/p/v8/issues/detail?id=3334
    var v8PrototypeDefineBug = DESCRIPTORS$h && fails$A(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty(function () { /* empty */ }, 'prototype', {
        value: 42,
        writable: false
      }).prototype != 42;
    });

    var isObject$g = isObject$k;

    var $String$2 = String;
    var $TypeError$g = TypeError;

    // `Assert: Type(argument) is Object`
    var anObject$L = function (argument) {
      if (isObject$g(argument)) return argument;
      throw $TypeError$g($String$2(argument) + ' is not an object');
    };

    var DESCRIPTORS$g = descriptors;
    var IE8_DOM_DEFINE = ie8DomDefine;
    var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
    var anObject$K = anObject$L;
    var toPropertyKey$2 = toPropertyKey$4;

    var $TypeError$f = TypeError;
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    var $defineProperty$1 = Object.defineProperty;
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
    var ENUMERABLE = 'enumerable';
    var CONFIGURABLE$1 = 'configurable';
    var WRITABLE = 'writable';

    // `Object.defineProperty` method
    // https://tc39.es/ecma262/#sec-object.defineproperty
    objectDefineProperty.f = DESCRIPTORS$g ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
      anObject$K(O);
      P = toPropertyKey$2(P);
      anObject$K(Attributes);
      if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
        var current = $getOwnPropertyDescriptor$1(O, P);
        if (current && current[WRITABLE]) {
          O[P] = Attributes.value;
          Attributes = {
            configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
            enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
            writable: false
          };
        }
      } return $defineProperty$1(O, P, Attributes);
    } : $defineProperty$1 : function defineProperty(O, P, Attributes) {
      anObject$K(O);
      P = toPropertyKey$2(P);
      anObject$K(Attributes);
      if (IE8_DOM_DEFINE) try {
        return $defineProperty$1(O, P, Attributes);
      } catch (error) { /* empty */ }
      if ('get' in Attributes || 'set' in Attributes) throw $TypeError$f('Accessors not supported');
      if ('value' in Attributes) O[P] = Attributes.value;
      return O;
    };

    var DESCRIPTORS$f = descriptors;
    var definePropertyModule$6 = objectDefineProperty;
    var createPropertyDescriptor$3 = createPropertyDescriptor$5;

    var createNonEnumerableProperty$7 = DESCRIPTORS$f ? function (object, key, value) {
      return definePropertyModule$6.f(object, key, createPropertyDescriptor$3(1, value));
    } : function (object, key, value) {
      object[key] = value;
      return object;
    };

    var makeBuiltIn$2 = {exports: {}};

    var DESCRIPTORS$e = descriptors;
    var hasOwn$h = hasOwnProperty_1;

    var FunctionPrototype$2 = Function.prototype;
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var getDescriptor = DESCRIPTORS$e && Object.getOwnPropertyDescriptor;

    var EXISTS = hasOwn$h(FunctionPrototype$2, 'name');
    // additional protection from minified / mangled / dropped function names
    var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
    var CONFIGURABLE = EXISTS && (!DESCRIPTORS$e || (DESCRIPTORS$e && getDescriptor(FunctionPrototype$2, 'name').configurable));

    var functionName = {
      EXISTS: EXISTS,
      PROPER: PROPER,
      CONFIGURABLE: CONFIGURABLE
    };

    var uncurryThis$y = functionUncurryThis;
    var isCallable$l = isCallable$r;
    var store$1 = sharedStore;

    var functionToString$1 = uncurryThis$y(Function.toString);

    // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
    if (!isCallable$l(store$1.inspectSource)) {
      store$1.inspectSource = function (it) {
        return functionToString$1(it);
      };
    }

    var inspectSource$3 = store$1.inspectSource;

    var global$n = global$u;
    var isCallable$k = isCallable$r;

    var WeakMap$1 = global$n.WeakMap;

    var weakMapBasicDetection = isCallable$k(WeakMap$1) && /native code/.test(String(WeakMap$1));

    var shared$5 = shared$7.exports;
    var uid$2 = uid$4;

    var keys$2 = shared$5('keys');

    var sharedKey$4 = function (key) {
      return keys$2[key] || (keys$2[key] = uid$2(key));
    };

    var hiddenKeys$6 = {};

    var NATIVE_WEAK_MAP = weakMapBasicDetection;
    var global$m = global$u;
    var isObject$f = isObject$k;
    var createNonEnumerableProperty$6 = createNonEnumerableProperty$7;
    var hasOwn$g = hasOwnProperty_1;
    var shared$4 = sharedStore;
    var sharedKey$3 = sharedKey$4;
    var hiddenKeys$5 = hiddenKeys$6;

    var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
    var TypeError$4 = global$m.TypeError;
    var WeakMap = global$m.WeakMap;
    var set$2, get$1, has;

    var enforce = function (it) {
      return has(it) ? get$1(it) : set$2(it, {});
    };

    var getterFor = function (TYPE) {
      return function (it) {
        var state;
        if (!isObject$f(it) || (state = get$1(it)).type !== TYPE) {
          throw TypeError$4('Incompatible receiver, ' + TYPE + ' required');
        } return state;
      };
    };

    if (NATIVE_WEAK_MAP || shared$4.state) {
      var store = shared$4.state || (shared$4.state = new WeakMap());
      /* eslint-disable no-self-assign -- prototype methods protection */
      store.get = store.get;
      store.has = store.has;
      store.set = store.set;
      /* eslint-enable no-self-assign -- prototype methods protection */
      set$2 = function (it, metadata) {
        if (store.has(it)) throw TypeError$4(OBJECT_ALREADY_INITIALIZED);
        metadata.facade = it;
        store.set(it, metadata);
        return metadata;
      };
      get$1 = function (it) {
        return store.get(it) || {};
      };
      has = function (it) {
        return store.has(it);
      };
    } else {
      var STATE = sharedKey$3('state');
      hiddenKeys$5[STATE] = true;
      set$2 = function (it, metadata) {
        if (hasOwn$g(it, STATE)) throw TypeError$4(OBJECT_ALREADY_INITIALIZED);
        metadata.facade = it;
        createNonEnumerableProperty$6(it, STATE, metadata);
        return metadata;
      };
      get$1 = function (it) {
        return hasOwn$g(it, STATE) ? it[STATE] : {};
      };
      has = function (it) {
        return hasOwn$g(it, STATE);
      };
    }

    var internalState = {
      set: set$2,
      get: get$1,
      has: has,
      enforce: enforce,
      getterFor: getterFor
    };

    var fails$z = fails$G;
    var isCallable$j = isCallable$r;
    var hasOwn$f = hasOwnProperty_1;
    var DESCRIPTORS$d = descriptors;
    var CONFIGURABLE_FUNCTION_NAME$1 = functionName.CONFIGURABLE;
    var inspectSource$2 = inspectSource$3;
    var InternalStateModule$5 = internalState;

    var enforceInternalState$1 = InternalStateModule$5.enforce;
    var getInternalState$4 = InternalStateModule$5.get;
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    var defineProperty$b = Object.defineProperty;

    var CONFIGURABLE_LENGTH = DESCRIPTORS$d && !fails$z(function () {
      return defineProperty$b(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
    });

    var TEMPLATE = String(String).split('String');

    var makeBuiltIn$1 = makeBuiltIn$2.exports = function (value, name, options) {
      if (String(name).slice(0, 7) === 'Symbol(') {
        name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
      }
      if (options && options.getter) name = 'get ' + name;
      if (options && options.setter) name = 'set ' + name;
      if (!hasOwn$f(value, 'name') || (CONFIGURABLE_FUNCTION_NAME$1 && value.name !== name)) {
        if (DESCRIPTORS$d) defineProperty$b(value, 'name', { value: name, configurable: true });
        else value.name = name;
      }
      if (CONFIGURABLE_LENGTH && options && hasOwn$f(options, 'arity') && value.length !== options.arity) {
        defineProperty$b(value, 'length', { value: options.arity });
      }
      try {
        if (options && hasOwn$f(options, 'constructor') && options.constructor) {
          if (DESCRIPTORS$d) defineProperty$b(value, 'prototype', { writable: false });
        // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
        } else if (value.prototype) value.prototype = undefined;
      } catch (error) { /* empty */ }
      var state = enforceInternalState$1(value);
      if (!hasOwn$f(state, 'source')) {
        state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
      } return value;
    };

    // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    // eslint-disable-next-line no-extend-native -- required
    Function.prototype.toString = makeBuiltIn$1(function toString() {
      return isCallable$j(this) && getInternalState$4(this).source || inspectSource$2(this);
    }, 'toString');

    var isCallable$i = isCallable$r;
    var definePropertyModule$5 = objectDefineProperty;
    var makeBuiltIn = makeBuiltIn$2.exports;
    var defineGlobalProperty$1 = defineGlobalProperty$3;

    var defineBuiltIn$f = function (O, key, value, options) {
      if (!options) options = {};
      var simple = options.enumerable;
      var name = options.name !== undefined ? options.name : key;
      if (isCallable$i(value)) makeBuiltIn(value, name, options);
      if (options.global) {
        if (simple) O[key] = value;
        else defineGlobalProperty$1(key, value);
      } else {
        try {
          if (!options.unsafe) delete O[key];
          else if (O[key]) simple = true;
        } catch (error) { /* empty */ }
        if (simple) O[key] = value;
        else definePropertyModule$5.f(O, key, {
          value: value,
          enumerable: false,
          configurable: !options.nonConfigurable,
          writable: !options.nonWritable
        });
      } return O;
    };

    var objectGetOwnPropertyNames = {};

    var ceil = Math.ceil;
    var floor$2 = Math.floor;

    // `Math.trunc` method
    // https://tc39.es/ecma262/#sec-math.trunc
    // eslint-disable-next-line es/no-math-trunc -- safe
    var mathTrunc = Math.trunc || function trunc(x) {
      var n = +x;
      return (n > 0 ? floor$2 : ceil)(n);
    };

    var trunc = mathTrunc;

    // `ToIntegerOrInfinity` abstract operation
    // https://tc39.es/ecma262/#sec-tointegerorinfinity
    var toIntegerOrInfinity$4 = function (argument) {
      var number = +argument;
      // eslint-disable-next-line no-self-compare -- NaN check
      return number !== number || number === 0 ? 0 : trunc(number);
    };

    var toIntegerOrInfinity$3 = toIntegerOrInfinity$4;

    var max$3 = Math.max;
    var min$3 = Math.min;

    // Helper for a popular repeating case of the spec:
    // Let integer be ? ToInteger(index).
    // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
    var toAbsoluteIndex$3 = function (index, length) {
      var integer = toIntegerOrInfinity$3(index);
      return integer < 0 ? max$3(integer + length, 0) : min$3(integer, length);
    };

    var toIntegerOrInfinity$2 = toIntegerOrInfinity$4;

    var min$2 = Math.min;

    // `ToLength` abstract operation
    // https://tc39.es/ecma262/#sec-tolength
    var toLength$4 = function (argument) {
      return argument > 0 ? min$2(toIntegerOrInfinity$2(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
    };

    var toLength$3 = toLength$4;

    // `LengthOfArrayLike` abstract operation
    // https://tc39.es/ecma262/#sec-lengthofarraylike
    var lengthOfArrayLike$9 = function (obj) {
      return toLength$3(obj.length);
    };

    var toIndexedObject$a = toIndexedObject$c;
    var toAbsoluteIndex$2 = toAbsoluteIndex$3;
    var lengthOfArrayLike$8 = lengthOfArrayLike$9;

    // `Array.prototype.{ indexOf, includes }` methods implementation
    var createMethod$5 = function (IS_INCLUDES) {
      return function ($this, el, fromIndex) {
        var O = toIndexedObject$a($this);
        var length = lengthOfArrayLike$8(O);
        var index = toAbsoluteIndex$2(fromIndex, length);
        var value;
        // Array#includes uses SameValueZero equality algorithm
        // eslint-disable-next-line no-self-compare -- NaN check
        if (IS_INCLUDES && el != el) while (length > index) {
          value = O[index++];
          // eslint-disable-next-line no-self-compare -- NaN check
          if (value != value) return true;
        // Array#indexOf ignores holes, Array#includes - not
        } else for (;length > index; index++) {
          if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
        } return !IS_INCLUDES && -1;
      };
    };

    var arrayIncludes = {
      // `Array.prototype.includes` method
      // https://tc39.es/ecma262/#sec-array.prototype.includes
      includes: createMethod$5(true),
      // `Array.prototype.indexOf` method
      // https://tc39.es/ecma262/#sec-array.prototype.indexof
      indexOf: createMethod$5(false)
    };

    var uncurryThis$x = functionUncurryThis;
    var hasOwn$e = hasOwnProperty_1;
    var toIndexedObject$9 = toIndexedObject$c;
    var indexOf$1 = arrayIncludes.indexOf;
    var hiddenKeys$4 = hiddenKeys$6;

    var push$8 = uncurryThis$x([].push);

    var objectKeysInternal = function (object, names) {
      var O = toIndexedObject$9(object);
      var i = 0;
      var result = [];
      var key;
      for (key in O) !hasOwn$e(hiddenKeys$4, key) && hasOwn$e(O, key) && push$8(result, key);
      // Don't enum bug & hidden keys
      while (names.length > i) if (hasOwn$e(O, key = names[i++])) {
        ~indexOf$1(result, key) || push$8(result, key);
      }
      return result;
    };

    // IE8- don't enum bug keys
    var enumBugKeys$3 = [
      'constructor',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      'toString',
      'valueOf'
    ];

    var internalObjectKeys$1 = objectKeysInternal;
    var enumBugKeys$2 = enumBugKeys$3;

    var hiddenKeys$3 = enumBugKeys$2.concat('length', 'prototype');

    // `Object.getOwnPropertyNames` method
    // https://tc39.es/ecma262/#sec-object.getownpropertynames
    // eslint-disable-next-line es/no-object-getownpropertynames -- safe
    objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
      return internalObjectKeys$1(O, hiddenKeys$3);
    };

    var objectGetOwnPropertySymbols = {};

    // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
    objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

    var getBuiltIn$j = getBuiltIn$m;
    var uncurryThis$w = functionUncurryThis;
    var getOwnPropertyNamesModule$2 = objectGetOwnPropertyNames;
    var getOwnPropertySymbolsModule$3 = objectGetOwnPropertySymbols;
    var anObject$J = anObject$L;

    var concat$3 = uncurryThis$w([].concat);

    // all object keys, includes non-enumerable and symbols
    var ownKeys$3 = getBuiltIn$j('Reflect', 'ownKeys') || function ownKeys(it) {
      var keys = getOwnPropertyNamesModule$2.f(anObject$J(it));
      var getOwnPropertySymbols = getOwnPropertySymbolsModule$3.f;
      return getOwnPropertySymbols ? concat$3(keys, getOwnPropertySymbols(it)) : keys;
    };

    var hasOwn$d = hasOwnProperty_1;
    var ownKeys$2 = ownKeys$3;
    var getOwnPropertyDescriptorModule$2 = objectGetOwnPropertyDescriptor;
    var definePropertyModule$4 = objectDefineProperty;

    var copyConstructorProperties$2 = function (target, source, exceptions) {
      var keys = ownKeys$2(source);
      var defineProperty = definePropertyModule$4.f;
      var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule$2.f;
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!hasOwn$d(target, key) && !(exceptions && hasOwn$d(exceptions, key))) {
          defineProperty(target, key, getOwnPropertyDescriptor(source, key));
        }
      }
    };

    var fails$y = fails$G;
    var isCallable$h = isCallable$r;

    var replacement = /#|\.prototype\./;

    var isForced$5 = function (feature, detection) {
      var value = data[normalize(feature)];
      return value == POLYFILL ? true
        : value == NATIVE ? false
        : isCallable$h(detection) ? fails$y(detection)
        : !!detection;
    };

    var normalize = isForced$5.normalize = function (string) {
      return String(string).replace(replacement, '.').toLowerCase();
    };

    var data = isForced$5.data = {};
    var NATIVE = isForced$5.NATIVE = 'N';
    var POLYFILL = isForced$5.POLYFILL = 'P';

    var isForced_1 = isForced$5;

    var global$l = global$u;
    var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
    var createNonEnumerableProperty$5 = createNonEnumerableProperty$7;
    var defineBuiltIn$e = defineBuiltIn$f;
    var defineGlobalProperty = defineGlobalProperty$3;
    var copyConstructorProperties$1 = copyConstructorProperties$2;
    var isForced$4 = isForced_1;

    /*
      options.target         - name of the target object
      options.global         - target is the global object
      options.stat           - export as static methods of target
      options.proto          - export as prototype methods of target
      options.real           - real prototype method for the `pure` version
      options.forced         - export even if the native feature is available
      options.bind           - bind methods to the target, required for the `pure` version
      options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
      options.unsafe         - use the simple assignment of property instead of delete + defineProperty
      options.sham           - add a flag to not completely full polyfills
      options.enumerable     - export as enumerable property
      options.dontCallGetSet - prevent calling a getter on target
      options.name           - the .name of the function if it does not match the key
    */
    var _export = function (options, source) {
      var TARGET = options.target;
      var GLOBAL = options.global;
      var STATIC = options.stat;
      var FORCED, target, key, targetProperty, sourceProperty, descriptor;
      if (GLOBAL) {
        target = global$l;
      } else if (STATIC) {
        target = global$l[TARGET] || defineGlobalProperty(TARGET, {});
      } else {
        target = (global$l[TARGET] || {}).prototype;
      }
      if (target) for (key in source) {
        sourceProperty = source[key];
        if (options.dontCallGetSet) {
          descriptor = getOwnPropertyDescriptor$2(target, key);
          targetProperty = descriptor && descriptor.value;
        } else targetProperty = target[key];
        FORCED = isForced$4(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
        // contained in target
        if (!FORCED && targetProperty !== undefined) {
          if (typeof sourceProperty == typeof targetProperty) continue;
          copyConstructorProperties$1(sourceProperty, targetProperty);
        }
        // add a flag to not completely full polyfills
        if (options.sham || (targetProperty && targetProperty.sham)) {
          createNonEnumerableProperty$5(sourceProperty, 'sham', true);
        }
        defineBuiltIn$e(target, key, sourceProperty, options);
      }
    };

    var $$1b = _export;
    var fails$x = fails$G;
    var toIndexedObject$8 = toIndexedObject$c;
    var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
    var DESCRIPTORS$c = descriptors;

    var FAILS_ON_PRIMITIVES$4 = fails$x(function () { nativeGetOwnPropertyDescriptor$1(1); });
    var FORCED$6 = !DESCRIPTORS$c || FAILS_ON_PRIMITIVES$4;

    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
    $$1b({ target: 'Object', stat: true, forced: FORCED$6, sham: !DESCRIPTORS$c }, {
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
        return nativeGetOwnPropertyDescriptor$1(toIndexedObject$8(it), key);
      }
    });

    var dataframe = {};

    var wellKnownSymbol$o = wellKnownSymbol$q;

    var TO_STRING_TAG$3 = wellKnownSymbol$o('toStringTag');
    var test$1 = {};

    test$1[TO_STRING_TAG$3] = 'z';

    var toStringTagSupport = String(test$1) === '[object z]';

    var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
    var isCallable$g = isCallable$r;
    var classofRaw$1 = classofRaw$2;
    var wellKnownSymbol$n = wellKnownSymbol$q;

    var TO_STRING_TAG$2 = wellKnownSymbol$n('toStringTag');
    var $Object$1 = Object;

    // ES3 wrong here
    var CORRECT_ARGUMENTS = classofRaw$1(function () { return arguments; }()) == 'Arguments';

    // fallback for IE11 Script Access Denied error
    var tryGet = function (it, key) {
      try {
        return it[key];
      } catch (error) { /* empty */ }
    };

    // getting tag from ES6+ `Object.prototype.toString`
    var classof$a = TO_STRING_TAG_SUPPORT$2 ? classofRaw$1 : function (it) {
      var O, tag, result;
      return it === undefined ? 'Undefined' : it === null ? 'Null'
        // @@toStringTag case
        : typeof (tag = tryGet(O = $Object$1(it), TO_STRING_TAG$2)) == 'string' ? tag
        // builtinTag case
        : CORRECT_ARGUMENTS ? classofRaw$1(O)
        // ES3 arguments fallback
        : (result = classofRaw$1(O)) == 'Object' && isCallable$g(O.callee) ? 'Arguments' : result;
    };

    var classof$9 = classof$a;

    var $String$1 = String;

    var toString$f = function (argument) {
      if (classof$9(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
      return $String$1(argument);
    };

    var objectDefineProperties = {};

    var internalObjectKeys = objectKeysInternal;
    var enumBugKeys$1 = enumBugKeys$3;

    // `Object.keys` method
    // https://tc39.es/ecma262/#sec-object.keys
    // eslint-disable-next-line es/no-object-keys -- safe
    var objectKeys$4 = Object.keys || function keys(O) {
      return internalObjectKeys(O, enumBugKeys$1);
    };

    var DESCRIPTORS$b = descriptors;
    var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
    var definePropertyModule$3 = objectDefineProperty;
    var anObject$I = anObject$L;
    var toIndexedObject$7 = toIndexedObject$c;
    var objectKeys$3 = objectKeys$4;

    // `Object.defineProperties` method
    // https://tc39.es/ecma262/#sec-object.defineproperties
    // eslint-disable-next-line es/no-object-defineproperties -- safe
    objectDefineProperties.f = DESCRIPTORS$b && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
      anObject$I(O);
      var props = toIndexedObject$7(Properties);
      var keys = objectKeys$3(Properties);
      var length = keys.length;
      var index = 0;
      var key;
      while (length > index) definePropertyModule$3.f(O, key = keys[index++], props[key]);
      return O;
    };

    var getBuiltIn$i = getBuiltIn$m;

    var html$3 = getBuiltIn$i('document', 'documentElement');

    /* global ActiveXObject -- old IE, WSH */

    var anObject$H = anObject$L;
    var definePropertiesModule$1 = objectDefineProperties;
    var enumBugKeys = enumBugKeys$3;
    var hiddenKeys$2 = hiddenKeys$6;
    var html$2 = html$3;
    var documentCreateElement$1 = documentCreateElement$2;
    var sharedKey$2 = sharedKey$4;

    var GT = '>';
    var LT = '<';
    var PROTOTYPE$1 = 'prototype';
    var SCRIPT = 'script';
    var IE_PROTO$1 = sharedKey$2('IE_PROTO');

    var EmptyConstructor = function () { /* empty */ };

    var scriptTag = function (content) {
      return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
    };

    // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
    var NullProtoObjectViaActiveX = function (activeXDocument) {
      activeXDocument.write(scriptTag(''));
      activeXDocument.close();
      var temp = activeXDocument.parentWindow.Object;
      activeXDocument = null; // avoid memory leak
      return temp;
    };

    // Create object with fake `null` prototype: use iframe Object with cleared prototype
    var NullProtoObjectViaIFrame = function () {
      // Thrash, waste and sodomy: IE GC bug
      var iframe = documentCreateElement$1('iframe');
      var JS = 'java' + SCRIPT + ':';
      var iframeDocument;
      iframe.style.display = 'none';
      html$2.appendChild(iframe);
      // https://github.com/zloirock/core-js/issues/475
      iframe.src = String(JS);
      iframeDocument = iframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(scriptTag('document.F=Object'));
      iframeDocument.close();
      return iframeDocument.F;
    };

    // Check for document.domain and active x support
    // No need to use active x approach when document.domain is not set
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    // avoid IE GC bug
    var activeXDocument;
    var NullProtoObject = function () {
      try {
        activeXDocument = new ActiveXObject('htmlfile');
      } catch (error) { /* ignore */ }
      NullProtoObject = typeof document != 'undefined'
        ? document.domain && activeXDocument
          ? NullProtoObjectViaActiveX(activeXDocument) // old IE
          : NullProtoObjectViaIFrame()
        : NullProtoObjectViaActiveX(activeXDocument); // WSH
      var length = enumBugKeys.length;
      while (length--) delete NullProtoObject[PROTOTYPE$1][enumBugKeys[length]];
      return NullProtoObject();
    };

    hiddenKeys$2[IE_PROTO$1] = true;

    // `Object.create` method
    // https://tc39.es/ecma262/#sec-object.create
    // eslint-disable-next-line es/no-object-create -- safe
    var objectCreate = Object.create || function create(O, Properties) {
      var result;
      if (O !== null) {
        EmptyConstructor[PROTOTYPE$1] = anObject$H(O);
        result = new EmptyConstructor();
        EmptyConstructor[PROTOTYPE$1] = null;
        // add "__proto__" for Object.getPrototypeOf polyfill
        result[IE_PROTO$1] = O;
      } else result = NullProtoObject();
      return Properties === undefined ? result : definePropertiesModule$1.f(result, Properties);
    };

    var objectGetOwnPropertyNamesExternal = {};

    var toPropertyKey$1 = toPropertyKey$4;
    var definePropertyModule$2 = objectDefineProperty;
    var createPropertyDescriptor$2 = createPropertyDescriptor$5;

    var createProperty$5 = function (object, key, value) {
      var propertyKey = toPropertyKey$1(key);
      if (propertyKey in object) definePropertyModule$2.f(object, propertyKey, createPropertyDescriptor$2(0, value));
      else object[propertyKey] = value;
    };

    var toAbsoluteIndex$1 = toAbsoluteIndex$3;
    var lengthOfArrayLike$7 = lengthOfArrayLike$9;
    var createProperty$4 = createProperty$5;

    var $Array$3 = Array;
    var max$2 = Math.max;

    var arraySliceSimple = function (O, start, end) {
      var length = lengthOfArrayLike$7(O);
      var k = toAbsoluteIndex$1(start, length);
      var fin = toAbsoluteIndex$1(end === undefined ? length : end, length);
      var result = $Array$3(max$2(fin - k, 0));
      for (var n = 0; k < fin; k++, n++) createProperty$4(result, n, O[k]);
      result.length = n;
      return result;
    };

    /* eslint-disable es/no-object-getownpropertynames -- safe */

    var classof$8 = classofRaw$2;
    var toIndexedObject$6 = toIndexedObject$c;
    var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
    var arraySlice$7 = arraySliceSimple;

    var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
      ? Object.getOwnPropertyNames(window) : [];

    var getWindowNames = function (it) {
      try {
        return $getOwnPropertyNames$1(it);
      } catch (error) {
        return arraySlice$7(windowNames);
      }
    };

    // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
    objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames(it) {
      return windowNames && classof$8(it) == 'Window'
        ? getWindowNames(it)
        : $getOwnPropertyNames$1(toIndexedObject$6(it));
    };

    var wellKnownSymbolWrapped = {};

    var wellKnownSymbol$m = wellKnownSymbol$q;

    wellKnownSymbolWrapped.f = wellKnownSymbol$m;

    var global$k = global$u;

    var path$1 = global$k;

    var path = path$1;
    var hasOwn$c = hasOwnProperty_1;
    var wrappedWellKnownSymbolModule$1 = wellKnownSymbolWrapped;
    var defineProperty$a = objectDefineProperty.f;

    var wellKnownSymbolDefine = function (NAME) {
      var Symbol = path.Symbol || (path.Symbol = {});
      if (!hasOwn$c(Symbol, NAME)) defineProperty$a(Symbol, NAME, {
        value: wrappedWellKnownSymbolModule$1.f(NAME)
      });
    };

    var call$A = functionCall;
    var getBuiltIn$h = getBuiltIn$m;
    var wellKnownSymbol$l = wellKnownSymbol$q;
    var defineBuiltIn$d = defineBuiltIn$f;

    var symbolDefineToPrimitive = function () {
      var Symbol = getBuiltIn$h('Symbol');
      var SymbolPrototype = Symbol && Symbol.prototype;
      var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
      var TO_PRIMITIVE = wellKnownSymbol$l('toPrimitive');

      if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
        // `Symbol.prototype[@@toPrimitive]` method
        // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
        // eslint-disable-next-line no-unused-vars -- required for .length
        defineBuiltIn$d(SymbolPrototype, TO_PRIMITIVE, function (hint) {
          return call$A(valueOf, this);
        }, { arity: 1 });
      }
    };

    var defineProperty$9 = objectDefineProperty.f;
    var hasOwn$b = hasOwnProperty_1;
    var wellKnownSymbol$k = wellKnownSymbol$q;

    var TO_STRING_TAG$1 = wellKnownSymbol$k('toStringTag');

    var setToStringTag$5 = function (target, TAG, STATIC) {
      if (target && !STATIC) target = target.prototype;
      if (target && !hasOwn$b(target, TO_STRING_TAG$1)) {
        defineProperty$9(target, TO_STRING_TAG$1, { configurable: true, value: TAG });
      }
    };

    var classofRaw = classofRaw$2;
    var uncurryThis$v = functionUncurryThis;

    var functionUncurryThisClause = function (fn) {
      // Nashorn bug:
      //   https://github.com/zloirock/core-js/issues/1128
      //   https://github.com/zloirock/core-js/issues/1130
      if (classofRaw(fn) === 'Function') return uncurryThis$v(fn);
    };

    var uncurryThis$u = functionUncurryThisClause;
    var aCallable$q = aCallable$s;
    var NATIVE_BIND$2 = functionBindNative;

    var bind$k = uncurryThis$u(uncurryThis$u.bind);

    // optional / simple context binding
    var functionBindContext = function (fn, that) {
      aCallable$q(fn);
      return that === undefined ? fn : NATIVE_BIND$2 ? bind$k(fn, that) : function (/* ...args */) {
        return fn.apply(that, arguments);
      };
    };

    var classof$7 = classofRaw$2;

    // `IsArray` abstract operation
    // https://tc39.es/ecma262/#sec-isarray
    // eslint-disable-next-line es/no-array-isarray -- safe
    var isArray$4 = Array.isArray || function isArray(argument) {
      return classof$7(argument) == 'Array';
    };

    var uncurryThis$t = functionUncurryThis;
    var fails$w = fails$G;
    var isCallable$f = isCallable$r;
    var classof$6 = classof$a;
    var getBuiltIn$g = getBuiltIn$m;
    var inspectSource$1 = inspectSource$3;

    var noop$1 = function () { /* empty */ };
    var empty = [];
    var construct$1 = getBuiltIn$g('Reflect', 'construct');
    var constructorRegExp = /^\s*(?:class|function)\b/;
    var exec$4 = uncurryThis$t(constructorRegExp.exec);
    var INCORRECT_TO_STRING = !constructorRegExp.exec(noop$1);

    var isConstructorModern = function isConstructor(argument) {
      if (!isCallable$f(argument)) return false;
      try {
        construct$1(noop$1, empty, argument);
        return true;
      } catch (error) {
        return false;
      }
    };

    var isConstructorLegacy = function isConstructor(argument) {
      if (!isCallable$f(argument)) return false;
      switch (classof$6(argument)) {
        case 'AsyncFunction':
        case 'GeneratorFunction':
        case 'AsyncGeneratorFunction': return false;
      }
      try {
        // we can't check .prototype since constructors produced by .bind haven't it
        // `Function#toString` throws on some built-it function in some legacy engines
        // (for example, `DOMQuad` and similar in FF41-)
        return INCORRECT_TO_STRING || !!exec$4(constructorRegExp, inspectSource$1(argument));
      } catch (error) {
        return true;
      }
    };

    isConstructorLegacy.sham = true;

    // `IsConstructor` abstract operation
    // https://tc39.es/ecma262/#sec-isconstructor
    var isConstructor$4 = !construct$1 || fails$w(function () {
      var called;
      return isConstructorModern(isConstructorModern.call)
        || !isConstructorModern(Object)
        || !isConstructorModern(function () { called = true; })
        || called;
    }) ? isConstructorLegacy : isConstructorModern;

    var isArray$3 = isArray$4;
    var isConstructor$3 = isConstructor$4;
    var isObject$e = isObject$k;
    var wellKnownSymbol$j = wellKnownSymbol$q;

    var SPECIES$6 = wellKnownSymbol$j('species');
    var $Array$2 = Array;

    // a part of `ArraySpeciesCreate` abstract operation
    // https://tc39.es/ecma262/#sec-arrayspeciescreate
    var arraySpeciesConstructor$1 = function (originalArray) {
      var C;
      if (isArray$3(originalArray)) {
        C = originalArray.constructor;
        // cross-realm fallback
        if (isConstructor$3(C) && (C === $Array$2 || isArray$3(C.prototype))) C = undefined;
        else if (isObject$e(C)) {
          C = C[SPECIES$6];
          if (C === null) C = undefined;
        }
      } return C === undefined ? $Array$2 : C;
    };

    var arraySpeciesConstructor = arraySpeciesConstructor$1;

    // `ArraySpeciesCreate` abstract operation
    // https://tc39.es/ecma262/#sec-arrayspeciescreate
    var arraySpeciesCreate$2 = function (originalArray, length) {
      return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
    };

    var bind$j = functionBindContext;
    var uncurryThis$s = functionUncurryThis;
    var IndexedObject$3 = indexedObject;
    var toObject$b = toObject$d;
    var lengthOfArrayLike$6 = lengthOfArrayLike$9;
    var arraySpeciesCreate$1 = arraySpeciesCreate$2;

    var push$7 = uncurryThis$s([].push);

    // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
    var createMethod$4 = function (TYPE) {
      var IS_MAP = TYPE == 1;
      var IS_FILTER = TYPE == 2;
      var IS_SOME = TYPE == 3;
      var IS_EVERY = TYPE == 4;
      var IS_FIND_INDEX = TYPE == 6;
      var IS_FILTER_REJECT = TYPE == 7;
      var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
      return function ($this, callbackfn, that, specificCreate) {
        var O = toObject$b($this);
        var self = IndexedObject$3(O);
        var boundFunction = bind$j(callbackfn, that);
        var length = lengthOfArrayLike$6(self);
        var index = 0;
        var create = specificCreate || arraySpeciesCreate$1;
        var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
        var value, result;
        for (;length > index; index++) if (NO_HOLES || index in self) {
          value = self[index];
          result = boundFunction(value, index, O);
          if (TYPE) {
            if (IS_MAP) target[index] = result; // map
            else if (result) switch (TYPE) {
              case 3: return true;              // some
              case 5: return value;             // find
              case 6: return index;             // findIndex
              case 2: push$7(target, value);      // filter
            } else switch (TYPE) {
              case 4: return false;             // every
              case 7: push$7(target, value);      // filterReject
            }
          }
        }
        return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
      };
    };

    var arrayIteration = {
      // `Array.prototype.forEach` method
      // https://tc39.es/ecma262/#sec-array.prototype.foreach
      forEach: createMethod$4(0),
      // `Array.prototype.map` method
      // https://tc39.es/ecma262/#sec-array.prototype.map
      map: createMethod$4(1),
      // `Array.prototype.filter` method
      // https://tc39.es/ecma262/#sec-array.prototype.filter
      filter: createMethod$4(2),
      // `Array.prototype.some` method
      // https://tc39.es/ecma262/#sec-array.prototype.some
      some: createMethod$4(3),
      // `Array.prototype.every` method
      // https://tc39.es/ecma262/#sec-array.prototype.every
      every: createMethod$4(4),
      // `Array.prototype.find` method
      // https://tc39.es/ecma262/#sec-array.prototype.find
      find: createMethod$4(5),
      // `Array.prototype.findIndex` method
      // https://tc39.es/ecma262/#sec-array.prototype.findIndex
      findIndex: createMethod$4(6),
      // `Array.prototype.filterReject` method
      // https://github.com/tc39/proposal-array-filtering
      filterReject: createMethod$4(7)
    };

    var $$1a = _export;
    var global$j = global$u;
    var call$z = functionCall;
    var uncurryThis$r = functionUncurryThis;
    var DESCRIPTORS$a = descriptors;
    var NATIVE_SYMBOL$4 = symbolConstructorDetection;
    var fails$v = fails$G;
    var hasOwn$a = hasOwnProperty_1;
    var isPrototypeOf$6 = objectIsPrototypeOf;
    var anObject$G = anObject$L;
    var toIndexedObject$5 = toIndexedObject$c;
    var toPropertyKey = toPropertyKey$4;
    var $toString$1 = toString$f;
    var createPropertyDescriptor$1 = createPropertyDescriptor$5;
    var nativeObjectCreate = objectCreate;
    var objectKeys$2 = objectKeys$4;
    var getOwnPropertyNamesModule$1 = objectGetOwnPropertyNames;
    var getOwnPropertyNamesExternal = objectGetOwnPropertyNamesExternal;
    var getOwnPropertySymbolsModule$2 = objectGetOwnPropertySymbols;
    var getOwnPropertyDescriptorModule$1 = objectGetOwnPropertyDescriptor;
    var definePropertyModule$1 = objectDefineProperty;
    var definePropertiesModule = objectDefineProperties;
    var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
    var defineBuiltIn$c = defineBuiltIn$f;
    var shared$3 = shared$7.exports;
    var sharedKey$1 = sharedKey$4;
    var hiddenKeys$1 = hiddenKeys$6;
    var uid$1 = uid$4;
    var wellKnownSymbol$i = wellKnownSymbol$q;
    var wrappedWellKnownSymbolModule = wellKnownSymbolWrapped;
    var defineWellKnownSymbol$1 = wellKnownSymbolDefine;
    var defineSymbolToPrimitive = symbolDefineToPrimitive;
    var setToStringTag$4 = setToStringTag$5;
    var InternalStateModule$4 = internalState;
    var $forEach$1 = arrayIteration.forEach;

    var HIDDEN = sharedKey$1('hidden');
    var SYMBOL = 'Symbol';
    var PROTOTYPE = 'prototype';

    var setInternalState$4 = InternalStateModule$4.set;
    var getInternalState$3 = InternalStateModule$4.getterFor(SYMBOL);

    var ObjectPrototype$2 = Object[PROTOTYPE];
    var $Symbol = global$j.Symbol;
    var SymbolPrototype$1 = $Symbol && $Symbol[PROTOTYPE];
    var TypeError$3 = global$j.TypeError;
    var QObject = global$j.QObject;
    var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule$1.f;
    var nativeDefineProperty = definePropertyModule$1.f;
    var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
    var nativePropertyIsEnumerable = propertyIsEnumerableModule$1.f;
    var push$6 = uncurryThis$r([].push);

    var AllSymbols = shared$3('symbols');
    var ObjectPrototypeSymbols = shared$3('op-symbols');
    var WellKnownSymbolsStore = shared$3('wks');

    // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
    var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

    // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
    var setSymbolDescriptor = DESCRIPTORS$a && fails$v(function () {
      return nativeObjectCreate(nativeDefineProperty({}, 'a', {
        get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
      })).a != 7;
    }) ? function (O, P, Attributes) {
      var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype$2, P);
      if (ObjectPrototypeDescriptor) delete ObjectPrototype$2[P];
      nativeDefineProperty(O, P, Attributes);
      if (ObjectPrototypeDescriptor && O !== ObjectPrototype$2) {
        nativeDefineProperty(ObjectPrototype$2, P, ObjectPrototypeDescriptor);
      }
    } : nativeDefineProperty;

    var wrap = function (tag, description) {
      var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype$1);
      setInternalState$4(symbol, {
        type: SYMBOL,
        tag: tag,
        description: description
      });
      if (!DESCRIPTORS$a) symbol.description = description;
      return symbol;
    };

    var $defineProperty = function defineProperty(O, P, Attributes) {
      if (O === ObjectPrototype$2) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
      anObject$G(O);
      var key = toPropertyKey(P);
      anObject$G(Attributes);
      if (hasOwn$a(AllSymbols, key)) {
        if (!Attributes.enumerable) {
          if (!hasOwn$a(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor$1(1, {}));
          O[HIDDEN][key] = true;
        } else {
          if (hasOwn$a(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
          Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor$1(0, false) });
        } return setSymbolDescriptor(O, key, Attributes);
      } return nativeDefineProperty(O, key, Attributes);
    };

    var $defineProperties = function defineProperties(O, Properties) {
      anObject$G(O);
      var properties = toIndexedObject$5(Properties);
      var keys = objectKeys$2(properties).concat($getOwnPropertySymbols(properties));
      $forEach$1(keys, function (key) {
        if (!DESCRIPTORS$a || call$z($propertyIsEnumerable$1, properties, key)) $defineProperty(O, key, properties[key]);
      });
      return O;
    };

    var $create = function create(O, Properties) {
      return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
    };

    var $propertyIsEnumerable$1 = function propertyIsEnumerable(V) {
      var P = toPropertyKey(V);
      var enumerable = call$z(nativePropertyIsEnumerable, this, P);
      if (this === ObjectPrototype$2 && hasOwn$a(AllSymbols, P) && !hasOwn$a(ObjectPrototypeSymbols, P)) return false;
      return enumerable || !hasOwn$a(this, P) || !hasOwn$a(AllSymbols, P) || hasOwn$a(this, HIDDEN) && this[HIDDEN][P]
        ? enumerable : true;
    };

    var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
      var it = toIndexedObject$5(O);
      var key = toPropertyKey(P);
      if (it === ObjectPrototype$2 && hasOwn$a(AllSymbols, key) && !hasOwn$a(ObjectPrototypeSymbols, key)) return;
      var descriptor = nativeGetOwnPropertyDescriptor(it, key);
      if (descriptor && hasOwn$a(AllSymbols, key) && !(hasOwn$a(it, HIDDEN) && it[HIDDEN][key])) {
        descriptor.enumerable = true;
      }
      return descriptor;
    };

    var $getOwnPropertyNames = function getOwnPropertyNames(O) {
      var names = nativeGetOwnPropertyNames(toIndexedObject$5(O));
      var result = [];
      $forEach$1(names, function (key) {
        if (!hasOwn$a(AllSymbols, key) && !hasOwn$a(hiddenKeys$1, key)) push$6(result, key);
      });
      return result;
    };

    var $getOwnPropertySymbols = function (O) {
      var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$2;
      var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject$5(O));
      var result = [];
      $forEach$1(names, function (key) {
        if (hasOwn$a(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn$a(ObjectPrototype$2, key))) {
          push$6(result, AllSymbols[key]);
        }
      });
      return result;
    };

    // `Symbol` constructor
    // https://tc39.es/ecma262/#sec-symbol-constructor
    if (!NATIVE_SYMBOL$4) {
      $Symbol = function Symbol() {
        if (isPrototypeOf$6(SymbolPrototype$1, this)) throw TypeError$3('Symbol is not a constructor');
        var description = !arguments.length || arguments[0] === undefined ? undefined : $toString$1(arguments[0]);
        var tag = uid$1(description);
        var setter = function (value) {
          if (this === ObjectPrototype$2) call$z(setter, ObjectPrototypeSymbols, value);
          if (hasOwn$a(this, HIDDEN) && hasOwn$a(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
          setSymbolDescriptor(this, tag, createPropertyDescriptor$1(1, value));
        };
        if (DESCRIPTORS$a && USE_SETTER) setSymbolDescriptor(ObjectPrototype$2, tag, { configurable: true, set: setter });
        return wrap(tag, description);
      };

      SymbolPrototype$1 = $Symbol[PROTOTYPE];

      defineBuiltIn$c(SymbolPrototype$1, 'toString', function toString() {
        return getInternalState$3(this).tag;
      });

      defineBuiltIn$c($Symbol, 'withoutSetter', function (description) {
        return wrap(uid$1(description), description);
      });

      propertyIsEnumerableModule$1.f = $propertyIsEnumerable$1;
      definePropertyModule$1.f = $defineProperty;
      definePropertiesModule.f = $defineProperties;
      getOwnPropertyDescriptorModule$1.f = $getOwnPropertyDescriptor;
      getOwnPropertyNamesModule$1.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
      getOwnPropertySymbolsModule$2.f = $getOwnPropertySymbols;

      wrappedWellKnownSymbolModule.f = function (name) {
        return wrap(wellKnownSymbol$i(name), name);
      };

      if (DESCRIPTORS$a) {
        // https://github.com/tc39/proposal-Symbol-description
        nativeDefineProperty(SymbolPrototype$1, 'description', {
          configurable: true,
          get: function description() {
            return getInternalState$3(this).description;
          }
        });
        {
          defineBuiltIn$c(ObjectPrototype$2, 'propertyIsEnumerable', $propertyIsEnumerable$1, { unsafe: true });
        }
      }
    }

    $$1a({ global: true, constructor: true, wrap: true, forced: !NATIVE_SYMBOL$4, sham: !NATIVE_SYMBOL$4 }, {
      Symbol: $Symbol
    });

    $forEach$1(objectKeys$2(WellKnownSymbolsStore), function (name) {
      defineWellKnownSymbol$1(name);
    });

    $$1a({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL$4 }, {
      useSetter: function () { USE_SETTER = true; },
      useSimple: function () { USE_SETTER = false; }
    });

    $$1a({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL$4, sham: !DESCRIPTORS$a }, {
      // `Object.create` method
      // https://tc39.es/ecma262/#sec-object.create
      create: $create,
      // `Object.defineProperty` method
      // https://tc39.es/ecma262/#sec-object.defineproperty
      defineProperty: $defineProperty,
      // `Object.defineProperties` method
      // https://tc39.es/ecma262/#sec-object.defineproperties
      defineProperties: $defineProperties,
      // `Object.getOwnPropertyDescriptor` method
      // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
      getOwnPropertyDescriptor: $getOwnPropertyDescriptor
    });

    $$1a({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL$4 }, {
      // `Object.getOwnPropertyNames` method
      // https://tc39.es/ecma262/#sec-object.getownpropertynames
      getOwnPropertyNames: $getOwnPropertyNames
    });

    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    defineSymbolToPrimitive();

    // `Symbol.prototype[@@toStringTag]` property
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
    setToStringTag$4($Symbol, SYMBOL);

    hiddenKeys$1[HIDDEN] = true;

    var NATIVE_SYMBOL$3 = symbolConstructorDetection;

    /* eslint-disable es/no-symbol -- safe */
    var symbolRegistryDetection = NATIVE_SYMBOL$3 && !!Symbol['for'] && !!Symbol.keyFor;

    var $$19 = _export;
    var getBuiltIn$f = getBuiltIn$m;
    var hasOwn$9 = hasOwnProperty_1;
    var toString$e = toString$f;
    var shared$2 = shared$7.exports;
    var NATIVE_SYMBOL_REGISTRY$1 = symbolRegistryDetection;

    var StringToSymbolRegistry = shared$2('string-to-symbol-registry');
    var SymbolToStringRegistry$1 = shared$2('symbol-to-string-registry');

    // `Symbol.for` method
    // https://tc39.es/ecma262/#sec-symbol.for
    $$19({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY$1 }, {
      'for': function (key) {
        var string = toString$e(key);
        if (hasOwn$9(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
        var symbol = getBuiltIn$f('Symbol')(string);
        StringToSymbolRegistry[string] = symbol;
        SymbolToStringRegistry$1[symbol] = string;
        return symbol;
      }
    });

    var $$18 = _export;
    var hasOwn$8 = hasOwnProperty_1;
    var isSymbol$2 = isSymbol$5;
    var tryToString$4 = tryToString$6;
    var shared$1 = shared$7.exports;
    var NATIVE_SYMBOL_REGISTRY = symbolRegistryDetection;

    var SymbolToStringRegistry = shared$1('symbol-to-string-registry');

    // `Symbol.keyFor` method
    // https://tc39.es/ecma262/#sec-symbol.keyfor
    $$18({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
      keyFor: function keyFor(sym) {
        if (!isSymbol$2(sym)) throw TypeError(tryToString$4(sym) + ' is not a symbol');
        if (hasOwn$8(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
      }
    });

    var NATIVE_BIND$1 = functionBindNative;

    var FunctionPrototype$1 = Function.prototype;
    var apply$5 = FunctionPrototype$1.apply;
    var call$y = FunctionPrototype$1.call;

    // eslint-disable-next-line es/no-reflect -- safe
    var functionApply = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND$1 ? call$y.bind(apply$5) : function () {
      return call$y.apply(apply$5, arguments);
    });

    var uncurryThis$q = functionUncurryThis;

    var arraySlice$6 = uncurryThis$q([].slice);

    var $$17 = _export;
    var getBuiltIn$e = getBuiltIn$m;
    var apply$4 = functionApply;
    var call$x = functionCall;
    var uncurryThis$p = functionUncurryThis;
    var fails$u = fails$G;
    var isArray$2 = isArray$4;
    var isCallable$e = isCallable$r;
    var isObject$d = isObject$k;
    var isSymbol$1 = isSymbol$5;
    var arraySlice$5 = arraySlice$6;
    var NATIVE_SYMBOL$2 = symbolConstructorDetection;

    var $stringify = getBuiltIn$e('JSON', 'stringify');
    var exec$3 = uncurryThis$p(/./.exec);
    var charAt$7 = uncurryThis$p(''.charAt);
    var charCodeAt$2 = uncurryThis$p(''.charCodeAt);
    var replace$5 = uncurryThis$p(''.replace);
    var numberToString = uncurryThis$p(1.0.toString);

    var tester = /[\uD800-\uDFFF]/g;
    var low = /^[\uD800-\uDBFF]$/;
    var hi = /^[\uDC00-\uDFFF]$/;

    var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL$2 || fails$u(function () {
      var symbol = getBuiltIn$e('Symbol')();
      // MS Edge converts symbol values to JSON as {}
      return $stringify([symbol]) != '[null]'
        // WebKit converts symbol values to JSON as null
        || $stringify({ a: symbol }) != '{}'
        // V8 throws on boxed symbols
        || $stringify(Object(symbol)) != '{}';
    });

    // https://github.com/tc39/proposal-well-formed-stringify
    var ILL_FORMED_UNICODE = fails$u(function () {
      return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
        || $stringify('\uDEAD') !== '"\\udead"';
    });

    var stringifyWithSymbolsFix = function (it, replacer) {
      var args = arraySlice$5(arguments);
      var $replacer = replacer;
      if (!isObject$d(replacer) && it === undefined || isSymbol$1(it)) return; // IE8 returns string on undefined
      if (!isArray$2(replacer)) replacer = function (key, value) {
        if (isCallable$e($replacer)) value = call$x($replacer, this, key, value);
        if (!isSymbol$1(value)) return value;
      };
      args[1] = replacer;
      return apply$4($stringify, null, args);
    };

    var fixIllFormed = function (match, offset, string) {
      var prev = charAt$7(string, offset - 1);
      var next = charAt$7(string, offset + 1);
      if ((exec$3(low, match) && !exec$3(hi, next)) || (exec$3(hi, match) && !exec$3(low, prev))) {
        return '\\u' + numberToString(charCodeAt$2(match, 0), 16);
      } return match;
    };

    if ($stringify) {
      // `JSON.stringify` method
      // https://tc39.es/ecma262/#sec-json.stringify
      $$17({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
        // eslint-disable-next-line no-unused-vars -- required for `.length`
        stringify: function stringify(it, replacer, space) {
          var args = arraySlice$5(arguments);
          var result = apply$4(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
          return ILL_FORMED_UNICODE && typeof result == 'string' ? replace$5(result, tester, fixIllFormed) : result;
        }
      });
    }

    var $$16 = _export;
    var NATIVE_SYMBOL$1 = symbolConstructorDetection;
    var fails$t = fails$G;
    var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
    var toObject$a = toObject$d;

    // V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
    // https://bugs.chromium.org/p/v8/issues/detail?id=3443
    var FORCED$5 = !NATIVE_SYMBOL$1 || fails$t(function () { getOwnPropertySymbolsModule$1.f(1); });

    // `Object.getOwnPropertySymbols` method
    // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
    $$16({ target: 'Object', stat: true, forced: FORCED$5 }, {
      getOwnPropertySymbols: function getOwnPropertySymbols(it) {
        var $getOwnPropertySymbols = getOwnPropertySymbolsModule$1.f;
        return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject$a(it)) : [];
      }
    });

    var $$15 = _export;
    var DESCRIPTORS$9 = descriptors;
    var global$i = global$u;
    var uncurryThis$o = functionUncurryThis;
    var hasOwn$7 = hasOwnProperty_1;
    var isCallable$d = isCallable$r;
    var isPrototypeOf$5 = objectIsPrototypeOf;
    var toString$d = toString$f;
    var defineProperty$8 = objectDefineProperty.f;
    var copyConstructorProperties = copyConstructorProperties$2;

    var NativeSymbol = global$i.Symbol;
    var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

    if (DESCRIPTORS$9 && isCallable$d(NativeSymbol) && (!('description' in SymbolPrototype) ||
      // Safari 12 bug
      NativeSymbol().description !== undefined
    )) {
      var EmptyStringDescriptionStore = {};
      // wrap Symbol constructor for correct work with undefined description
      var SymbolWrapper = function Symbol() {
        var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString$d(arguments[0]);
        var result = isPrototypeOf$5(SymbolPrototype, this)
          ? new NativeSymbol(description)
          // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
          : description === undefined ? NativeSymbol() : NativeSymbol(description);
        if (description === '') EmptyStringDescriptionStore[result] = true;
        return result;
      };

      copyConstructorProperties(SymbolWrapper, NativeSymbol);
      SymbolWrapper.prototype = SymbolPrototype;
      SymbolPrototype.constructor = SymbolWrapper;

      var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
      var thisSymbolValue = uncurryThis$o(SymbolPrototype.valueOf);
      var symbolDescriptiveString = uncurryThis$o(SymbolPrototype.toString);
      var regexp = /^Symbol\((.*)\)[^)]+$/;
      var replace$4 = uncurryThis$o(''.replace);
      var stringSlice$6 = uncurryThis$o(''.slice);

      defineProperty$8(SymbolPrototype, 'description', {
        configurable: true,
        get: function description() {
          var symbol = thisSymbolValue(this);
          if (hasOwn$7(EmptyStringDescriptionStore, symbol)) return '';
          var string = symbolDescriptiveString(symbol);
          var desc = NATIVE_SYMBOL ? stringSlice$6(string, 7, -1) : replace$4(string, regexp, '$1');
          return desc === '' ? undefined : desc;
        }
      });

      $$15({ global: true, constructor: true, forced: true }, {
        Symbol: SymbolWrapper
      });
    }

    var defineWellKnownSymbol = wellKnownSymbolDefine;

    // `Symbol.iterator` well-known symbol
    // https://tc39.es/ecma262/#sec-symbol.iterator
    defineWellKnownSymbol('iterator');

    var $TypeError$e = TypeError;
    var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

    var doesNotExceedSafeInteger$1 = function (it) {
      if (it > MAX_SAFE_INTEGER) throw $TypeError$e('Maximum allowed index exceeded');
      return it;
    };

    var fails$s = fails$G;
    var wellKnownSymbol$h = wellKnownSymbol$q;
    var V8_VERSION$2 = engineV8Version;

    var SPECIES$5 = wellKnownSymbol$h('species');

    var arrayMethodHasSpeciesSupport$4 = function (METHOD_NAME) {
      // We can't use this feature detection in V8 since it causes
      // deoptimization and serious performance degradation
      // https://github.com/zloirock/core-js/issues/677
      return V8_VERSION$2 >= 51 || !fails$s(function () {
        var array = [];
        var constructor = array.constructor = {};
        constructor[SPECIES$5] = function () {
          return { foo: 1 };
        };
        return array[METHOD_NAME](Boolean).foo !== 1;
      });
    };

    var $$14 = _export;
    var fails$r = fails$G;
    var isArray$1 = isArray$4;
    var isObject$c = isObject$k;
    var toObject$9 = toObject$d;
    var lengthOfArrayLike$5 = lengthOfArrayLike$9;
    var doesNotExceedSafeInteger = doesNotExceedSafeInteger$1;
    var createProperty$3 = createProperty$5;
    var arraySpeciesCreate = arraySpeciesCreate$2;
    var arrayMethodHasSpeciesSupport$3 = arrayMethodHasSpeciesSupport$4;
    var wellKnownSymbol$g = wellKnownSymbol$q;
    var V8_VERSION$1 = engineV8Version;

    var IS_CONCAT_SPREADABLE = wellKnownSymbol$g('isConcatSpreadable');

    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/679
    var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION$1 >= 51 || !fails$r(function () {
      var array = [];
      array[IS_CONCAT_SPREADABLE] = false;
      return array.concat()[0] !== array;
    });

    var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$3('concat');

    var isConcatSpreadable = function (O) {
      if (!isObject$c(O)) return false;
      var spreadable = O[IS_CONCAT_SPREADABLE];
      return spreadable !== undefined ? !!spreadable : isArray$1(O);
    };

    var FORCED$4 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

    // `Array.prototype.concat` method
    // https://tc39.es/ecma262/#sec-array.prototype.concat
    // with adding support of @@isConcatSpreadable and @@species
    $$14({ target: 'Array', proto: true, arity: 1, forced: FORCED$4 }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      concat: function concat(arg) {
        var O = toObject$9(this);
        var A = arraySpeciesCreate(O, 0);
        var n = 0;
        var i, k, length, len, E;
        for (i = -1, length = arguments.length; i < length; i++) {
          E = i === -1 ? O : arguments[i];
          if (isConcatSpreadable(E)) {
            len = lengthOfArrayLike$5(E);
            doesNotExceedSafeInteger(n + len);
            for (k = 0; k < len; k++, n++) if (k in E) createProperty$3(A, n, E[k]);
          } else {
            doesNotExceedSafeInteger(n + 1);
            createProperty$3(A, n++, E);
          }
        }
        A.length = n;
        return A;
      }
    });

    var $$13 = _export;
    var $filter = arrayIteration.filter;
    var arrayMethodHasSpeciesSupport$2 = arrayMethodHasSpeciesSupport$4;

    var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport$2('filter');

    // `Array.prototype.filter` method
    // https://tc39.es/ecma262/#sec-array.prototype.filter
    // with adding support of @@species
    $$13({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
      filter: function filter(callbackfn /* , thisArg */) {
        return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
      }
    });

    var fails$q = fails$G;

    var arrayMethodIsStrict$6 = function (METHOD_NAME, argument) {
      var method = [][METHOD_NAME];
      return !!method && fails$q(function () {
        // eslint-disable-next-line no-useless-call -- required for testing
        method.call(null, argument || function () { return 1; }, 1);
      });
    };

    var $forEach = arrayIteration.forEach;
    var arrayMethodIsStrict$5 = arrayMethodIsStrict$6;

    var STRICT_METHOD$5 = arrayMethodIsStrict$5('forEach');

    // `Array.prototype.forEach` method implementation
    // https://tc39.es/ecma262/#sec-array.prototype.foreach
    var arrayForEach = !STRICT_METHOD$5 ? function forEach(callbackfn /* , thisArg */) {
      return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    // eslint-disable-next-line es/no-array-prototype-foreach -- safe
    } : [].forEach;

    var $$12 = _export;
    var forEach$1 = arrayForEach;

    // `Array.prototype.forEach` method
    // https://tc39.es/ecma262/#sec-array.prototype.foreach
    // eslint-disable-next-line es/no-array-prototype-foreach -- safe
    $$12({ target: 'Array', proto: true, forced: [].forEach != forEach$1 }, {
      forEach: forEach$1
    });

    var call$w = functionCall;
    var anObject$F = anObject$L;
    var getMethod$4 = getMethod$6;

    var iteratorClose$2 = function (iterator, kind, value) {
      var innerResult, innerError;
      anObject$F(iterator);
      try {
        innerResult = getMethod$4(iterator, 'return');
        if (!innerResult) {
          if (kind === 'throw') throw value;
          return value;
        }
        innerResult = call$w(innerResult, iterator);
      } catch (error) {
        innerError = true;
        innerResult = error;
      }
      if (kind === 'throw') throw value;
      if (innerError) throw innerResult;
      anObject$F(innerResult);
      return value;
    };

    var anObject$E = anObject$L;
    var iteratorClose$1 = iteratorClose$2;

    // call something on iterator step with safe closing on error
    var callWithSafeIterationClosing$1 = function (iterator, fn, value, ENTRIES) {
      try {
        return ENTRIES ? fn(anObject$E(value)[0], value[1]) : fn(value);
      } catch (error) {
        iteratorClose$1(iterator, 'throw', error);
      }
    };

    var iterators = {};

    var wellKnownSymbol$f = wellKnownSymbol$q;
    var Iterators$4 = iterators;

    var ITERATOR$6 = wellKnownSymbol$f('iterator');
    var ArrayPrototype$1 = Array.prototype;

    // check on default Array iterator
    var isArrayIteratorMethod$2 = function (it) {
      return it !== undefined && (Iterators$4.Array === it || ArrayPrototype$1[ITERATOR$6] === it);
    };

    var classof$5 = classof$a;
    var getMethod$3 = getMethod$6;
    var isNullOrUndefined$6 = isNullOrUndefined$9;
    var Iterators$3 = iterators;
    var wellKnownSymbol$e = wellKnownSymbol$q;

    var ITERATOR$5 = wellKnownSymbol$e('iterator');

    var getIteratorMethod$3 = function (it) {
      if (!isNullOrUndefined$6(it)) return getMethod$3(it, ITERATOR$5)
        || getMethod$3(it, '@@iterator')
        || Iterators$3[classof$5(it)];
    };

    var call$v = functionCall;
    var aCallable$p = aCallable$s;
    var anObject$D = anObject$L;
    var tryToString$3 = tryToString$6;
    var getIteratorMethod$2 = getIteratorMethod$3;

    var $TypeError$d = TypeError;

    var getIterator$3 = function (argument, usingIterator) {
      var iteratorMethod = arguments.length < 2 ? getIteratorMethod$2(argument) : usingIterator;
      if (aCallable$p(iteratorMethod)) return anObject$D(call$v(iteratorMethod, argument));
      throw $TypeError$d(tryToString$3(argument) + ' is not iterable');
    };

    var bind$i = functionBindContext;
    var call$u = functionCall;
    var toObject$8 = toObject$d;
    var callWithSafeIterationClosing = callWithSafeIterationClosing$1;
    var isArrayIteratorMethod$1 = isArrayIteratorMethod$2;
    var isConstructor$2 = isConstructor$4;
    var lengthOfArrayLike$4 = lengthOfArrayLike$9;
    var createProperty$2 = createProperty$5;
    var getIterator$2 = getIterator$3;
    var getIteratorMethod$1 = getIteratorMethod$3;

    var $Array$1 = Array;

    // `Array.from` method implementation
    // https://tc39.es/ecma262/#sec-array.from
    var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
      var O = toObject$8(arrayLike);
      var IS_CONSTRUCTOR = isConstructor$2(this);
      var argumentsLength = arguments.length;
      var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
      var mapping = mapfn !== undefined;
      if (mapping) mapfn = bind$i(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
      var iteratorMethod = getIteratorMethod$1(O);
      var index = 0;
      var length, result, step, iterator, next, value;
      // if the target is not iterable or it's an array with the default iterator - use a simple case
      if (iteratorMethod && !(this === $Array$1 && isArrayIteratorMethod$1(iteratorMethod))) {
        iterator = getIterator$2(O, iteratorMethod);
        next = iterator.next;
        result = IS_CONSTRUCTOR ? new this() : [];
        for (;!(step = call$u(next, iterator)).done; index++) {
          value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
          createProperty$2(result, index, value);
        }
      } else {
        length = lengthOfArrayLike$4(O);
        result = IS_CONSTRUCTOR ? new this(length) : $Array$1(length);
        for (;length > index; index++) {
          value = mapping ? mapfn(O[index], index) : O[index];
          createProperty$2(result, index, value);
        }
      }
      result.length = index;
      return result;
    };

    var wellKnownSymbol$d = wellKnownSymbol$q;

    var ITERATOR$4 = wellKnownSymbol$d('iterator');
    var SAFE_CLOSING = false;

    try {
      var called = 0;
      var iteratorWithReturn = {
        next: function () {
          return { done: !!called++ };
        },
        'return': function () {
          SAFE_CLOSING = true;
        }
      };
      iteratorWithReturn[ITERATOR$4] = function () {
        return this;
      };
      // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
      Array.from(iteratorWithReturn, function () { throw 2; });
    } catch (error) { /* empty */ }

    var checkCorrectnessOfIteration$3 = function (exec, SKIP_CLOSING) {
      if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
      var ITERATION_SUPPORT = false;
      try {
        var object = {};
        object[ITERATOR$4] = function () {
          return {
            next: function () {
              return { done: ITERATION_SUPPORT = true };
            }
          };
        };
        exec(object);
      } catch (error) { /* empty */ }
      return ITERATION_SUPPORT;
    };

    var $$11 = _export;
    var from = arrayFrom;
    var checkCorrectnessOfIteration$2 = checkCorrectnessOfIteration$3;

    var INCORRECT_ITERATION = !checkCorrectnessOfIteration$2(function (iterable) {
      // eslint-disable-next-line es/no-array-from -- required for testing
      Array.from(iterable);
    });

    // `Array.from` method
    // https://tc39.es/ecma262/#sec-array.from
    $$11({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
      from: from
    });

    var wellKnownSymbol$c = wellKnownSymbol$q;
    var create$4 = objectCreate;
    var defineProperty$7 = objectDefineProperty.f;

    var UNSCOPABLES = wellKnownSymbol$c('unscopables');
    var ArrayPrototype = Array.prototype;

    // Array.prototype[@@unscopables]
    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    if (ArrayPrototype[UNSCOPABLES] == undefined) {
      defineProperty$7(ArrayPrototype, UNSCOPABLES, {
        configurable: true,
        value: create$4(null)
      });
    }

    // add a key to Array.prototype[@@unscopables]
    var addToUnscopables$4 = function (key) {
      ArrayPrototype[UNSCOPABLES][key] = true;
    };

    var $$10 = _export;
    var $includes = arrayIncludes.includes;
    var fails$p = fails$G;
    var addToUnscopables$3 = addToUnscopables$4;

    // FF99+ bug
    var BROKEN_ON_SPARSE = fails$p(function () {
      return !Array(1).includes();
    });

    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    $$10({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
      includes: function includes(el /* , fromIndex = 0 */) {
        return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
      }
    });

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables$3('includes');

    var fails$o = fails$G;

    var correctPrototypeGetter = !fails$o(function () {
      function F() { /* empty */ }
      F.prototype.constructor = null;
      // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
      return Object.getPrototypeOf(new F()) !== F.prototype;
    });

    var hasOwn$6 = hasOwnProperty_1;
    var isCallable$c = isCallable$r;
    var toObject$7 = toObject$d;
    var sharedKey = sharedKey$4;
    var CORRECT_PROTOTYPE_GETTER$1 = correctPrototypeGetter;

    var IE_PROTO = sharedKey('IE_PROTO');
    var $Object = Object;
    var ObjectPrototype$1 = $Object.prototype;

    // `Object.getPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.getprototypeof
    // eslint-disable-next-line es/no-object-getprototypeof -- safe
    var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER$1 ? $Object.getPrototypeOf : function (O) {
      var object = toObject$7(O);
      if (hasOwn$6(object, IE_PROTO)) return object[IE_PROTO];
      var constructor = object.constructor;
      if (isCallable$c(constructor) && object instanceof constructor) {
        return constructor.prototype;
      } return object instanceof $Object ? ObjectPrototype$1 : null;
    };

    var fails$n = fails$G;
    var isCallable$b = isCallable$r;
    var isObject$b = isObject$k;
    var getPrototypeOf$1 = objectGetPrototypeOf;
    var defineBuiltIn$b = defineBuiltIn$f;
    var wellKnownSymbol$b = wellKnownSymbol$q;

    var ITERATOR$3 = wellKnownSymbol$b('iterator');
    var BUGGY_SAFARI_ITERATORS$1 = false;

    // `%IteratorPrototype%` object
    // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
    var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

    /* eslint-disable es/no-array-prototype-keys -- safe */
    if ([].keys) {
      arrayIterator = [].keys();
      // Safari 8 has buggy iterators w/o `next`
      if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
      else {
        PrototypeOfArrayIteratorPrototype = getPrototypeOf$1(getPrototypeOf$1(arrayIterator));
        if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
      }
    }

    var NEW_ITERATOR_PROTOTYPE = !isObject$b(IteratorPrototype$2) || fails$n(function () {
      var test = {};
      // FF44- legacy iterators case
      return IteratorPrototype$2[ITERATOR$3].call(test) !== test;
    });

    if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

    // `%IteratorPrototype%[@@iterator]()` method
    // https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
    if (!isCallable$b(IteratorPrototype$2[ITERATOR$3])) {
      defineBuiltIn$b(IteratorPrototype$2, ITERATOR$3, function () {
        return this;
      });
    }

    var iteratorsCore = {
      IteratorPrototype: IteratorPrototype$2,
      BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
    };

    var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
    var create$3 = objectCreate;
    var createPropertyDescriptor = createPropertyDescriptor$5;
    var setToStringTag$3 = setToStringTag$5;
    var Iterators$2 = iterators;

    var returnThis$1 = function () { return this; };

    var iteratorCreateConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
      var TO_STRING_TAG = NAME + ' Iterator';
      IteratorConstructor.prototype = create$3(IteratorPrototype$1, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
      setToStringTag$3(IteratorConstructor, TO_STRING_TAG, false);
      Iterators$2[TO_STRING_TAG] = returnThis$1;
      return IteratorConstructor;
    };

    var isCallable$a = isCallable$r;

    var $String = String;
    var $TypeError$c = TypeError;

    var aPossiblePrototype$1 = function (argument) {
      if (typeof argument == 'object' || isCallable$a(argument)) return argument;
      throw $TypeError$c("Can't set " + $String(argument) + ' as a prototype');
    };

    /* eslint-disable no-proto -- safe */

    var uncurryThis$n = functionUncurryThis;
    var anObject$C = anObject$L;
    var aPossiblePrototype = aPossiblePrototype$1;

    // `Object.setPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.setprototypeof
    // Works with __proto__ only. Old v8 can't work with null proto objects.
    // eslint-disable-next-line es/no-object-setprototypeof -- safe
    var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
      var CORRECT_SETTER = false;
      var test = {};
      var setter;
      try {
        // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
        setter = uncurryThis$n(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
        setter(test, []);
        CORRECT_SETTER = test instanceof Array;
      } catch (error) { /* empty */ }
      return function setPrototypeOf(O, proto) {
        anObject$C(O);
        aPossiblePrototype(proto);
        if (CORRECT_SETTER) setter(O, proto);
        else O.__proto__ = proto;
        return O;
      };
    }() : undefined);

    var $$$ = _export;
    var call$t = functionCall;
    var FunctionName = functionName;
    var isCallable$9 = isCallable$r;
    var createIteratorConstructor = iteratorCreateConstructor;
    var getPrototypeOf = objectGetPrototypeOf;
    var setPrototypeOf$3 = objectSetPrototypeOf;
    var setToStringTag$2 = setToStringTag$5;
    var createNonEnumerableProperty$4 = createNonEnumerableProperty$7;
    var defineBuiltIn$a = defineBuiltIn$f;
    var wellKnownSymbol$a = wellKnownSymbol$q;
    var Iterators$1 = iterators;
    var IteratorsCore = iteratorsCore;

    var PROPER_FUNCTION_NAME$2 = FunctionName.PROPER;
    var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
    var IteratorPrototype = IteratorsCore.IteratorPrototype;
    var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
    var ITERATOR$2 = wellKnownSymbol$a('iterator');
    var KEYS = 'keys';
    var VALUES = 'values';
    var ENTRIES = 'entries';

    var returnThis = function () { return this; };

    var iteratorDefine = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
      createIteratorConstructor(IteratorConstructor, NAME, next);

      var getIterationMethod = function (KIND) {
        if (KIND === DEFAULT && defaultIterator) return defaultIterator;
        if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
        switch (KIND) {
          case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
          case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
          case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
        } return function () { return new IteratorConstructor(this); };
      };

      var TO_STRING_TAG = NAME + ' Iterator';
      var INCORRECT_VALUES_NAME = false;
      var IterablePrototype = Iterable.prototype;
      var nativeIterator = IterablePrototype[ITERATOR$2]
        || IterablePrototype['@@iterator']
        || DEFAULT && IterablePrototype[DEFAULT];
      var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
      var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
      var CurrentIteratorPrototype, methods, KEY;

      // fix native
      if (anyNativeIterator) {
        CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
        if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
          if (getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
            if (setPrototypeOf$3) {
              setPrototypeOf$3(CurrentIteratorPrototype, IteratorPrototype);
            } else if (!isCallable$9(CurrentIteratorPrototype[ITERATOR$2])) {
              defineBuiltIn$a(CurrentIteratorPrototype, ITERATOR$2, returnThis);
            }
          }
          // Set @@toStringTag to native iterators
          setToStringTag$2(CurrentIteratorPrototype, TO_STRING_TAG, true);
        }
      }

      // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
      if (PROPER_FUNCTION_NAME$2 && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
        if (CONFIGURABLE_FUNCTION_NAME) {
          createNonEnumerableProperty$4(IterablePrototype, 'name', VALUES);
        } else {
          INCORRECT_VALUES_NAME = true;
          defaultIterator = function values() { return call$t(nativeIterator, this); };
        }
      }

      // export additional methods
      if (DEFAULT) {
        methods = {
          values: getIterationMethod(VALUES),
          keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
          entries: getIterationMethod(ENTRIES)
        };
        if (FORCED) for (KEY in methods) {
          if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
            defineBuiltIn$a(IterablePrototype, KEY, methods[KEY]);
          }
        } else $$$({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
      }

      // define iterator
      if (IterablePrototype[ITERATOR$2] !== defaultIterator) {
        defineBuiltIn$a(IterablePrototype, ITERATOR$2, defaultIterator, { name: DEFAULT });
      }
      Iterators$1[NAME] = defaultIterator;

      return methods;
    };

    // `CreateIterResultObject` abstract operation
    // https://tc39.es/ecma262/#sec-createiterresultobject
    var createIterResultObject$3 = function (value, done) {
      return { value: value, done: done };
    };

    var toIndexedObject$4 = toIndexedObject$c;
    var addToUnscopables$2 = addToUnscopables$4;
    var Iterators = iterators;
    var InternalStateModule$3 = internalState;
    var defineProperty$6 = objectDefineProperty.f;
    var defineIterator$2 = iteratorDefine;
    var createIterResultObject$2 = createIterResultObject$3;
    var DESCRIPTORS$8 = descriptors;

    var ARRAY_ITERATOR = 'Array Iterator';
    var setInternalState$3 = InternalStateModule$3.set;
    var getInternalState$2 = InternalStateModule$3.getterFor(ARRAY_ITERATOR);

    // `Array.prototype.entries` method
    // https://tc39.es/ecma262/#sec-array.prototype.entries
    // `Array.prototype.keys` method
    // https://tc39.es/ecma262/#sec-array.prototype.keys
    // `Array.prototype.values` method
    // https://tc39.es/ecma262/#sec-array.prototype.values
    // `Array.prototype[@@iterator]` method
    // https://tc39.es/ecma262/#sec-array.prototype-@@iterator
    // `CreateArrayIterator` internal method
    // https://tc39.es/ecma262/#sec-createarrayiterator
    var es_array_iterator = defineIterator$2(Array, 'Array', function (iterated, kind) {
      setInternalState$3(this, {
        type: ARRAY_ITERATOR,
        target: toIndexedObject$4(iterated), // target
        index: 0,                          // next index
        kind: kind                         // kind
      });
    // `%ArrayIteratorPrototype%.next` method
    // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
    }, function () {
      var state = getInternalState$2(this);
      var target = state.target;
      var kind = state.kind;
      var index = state.index++;
      if (!target || index >= target.length) {
        state.target = undefined;
        return createIterResultObject$2(undefined, true);
      }
      if (kind == 'keys') return createIterResultObject$2(index, false);
      if (kind == 'values') return createIterResultObject$2(target[index], false);
      return createIterResultObject$2([index, target[index]], false);
    }, 'values');

    // argumentsList[@@iterator] is %ArrayProto_values%
    // https://tc39.es/ecma262/#sec-createunmappedargumentsobject
    // https://tc39.es/ecma262/#sec-createmappedargumentsobject
    var values = Iterators.Arguments = Iterators.Array;

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables$2('keys');
    addToUnscopables$2('values');
    addToUnscopables$2('entries');

    // V8 ~ Chrome 45- bug
    if (DESCRIPTORS$8 && values.name !== 'values') try {
      defineProperty$6(values, 'name', { value: 'values' });
    } catch (error) { /* empty */ }

    var $$_ = _export;
    var uncurryThis$m = functionUncurryThis;
    var IndexedObject$2 = indexedObject;
    var toIndexedObject$3 = toIndexedObject$c;
    var arrayMethodIsStrict$4 = arrayMethodIsStrict$6;

    var nativeJoin = uncurryThis$m([].join);

    var ES3_STRINGS = IndexedObject$2 != Object;
    var STRICT_METHOD$4 = arrayMethodIsStrict$4('join', ',');

    // `Array.prototype.join` method
    // https://tc39.es/ecma262/#sec-array.prototype.join
    $$_({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$4 }, {
      join: function join(separator) {
        return nativeJoin(toIndexedObject$3(this), separator === undefined ? ',' : separator);
      }
    });

    var $$Z = _export;
    var $map = arrayIteration.map;
    var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$4;

    var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$1('map');

    // `Array.prototype.map` method
    // https://tc39.es/ecma262/#sec-array.prototype.map
    // with adding support of @@species
    $$Z({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
      map: function map(callbackfn /* , thisArg */) {
        return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
      }
    });

    var aCallable$o = aCallable$s;
    var toObject$6 = toObject$d;
    var IndexedObject$1 = indexedObject;
    var lengthOfArrayLike$3 = lengthOfArrayLike$9;

    var $TypeError$b = TypeError;

    // `Array.prototype.{ reduce, reduceRight }` methods implementation
    var createMethod$3 = function (IS_RIGHT) {
      return function (that, callbackfn, argumentsLength, memo) {
        aCallable$o(callbackfn);
        var O = toObject$6(that);
        var self = IndexedObject$1(O);
        var length = lengthOfArrayLike$3(O);
        var index = IS_RIGHT ? length - 1 : 0;
        var i = IS_RIGHT ? -1 : 1;
        if (argumentsLength < 2) while (true) {
          if (index in self) {
            memo = self[index];
            index += i;
            break;
          }
          index += i;
          if (IS_RIGHT ? index < 0 : length <= index) {
            throw $TypeError$b('Reduce of empty array with no initial value');
          }
        }
        for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
          memo = callbackfn(memo, self[index], index, O);
        }
        return memo;
      };
    };

    var arrayReduce = {
      // `Array.prototype.reduce` method
      // https://tc39.es/ecma262/#sec-array.prototype.reduce
      left: createMethod$3(false),
      // `Array.prototype.reduceRight` method
      // https://tc39.es/ecma262/#sec-array.prototype.reduceright
      right: createMethod$3(true)
    };

    var classof$4 = classofRaw$2;
    var global$h = global$u;

    var engineIsNode = classof$4(global$h.process) == 'process';

    var $$Y = _export;
    var $reduce = arrayReduce.left;
    var arrayMethodIsStrict$3 = arrayMethodIsStrict$6;
    var CHROME_VERSION$1 = engineV8Version;
    var IS_NODE$5 = engineIsNode;

    var STRICT_METHOD$3 = arrayMethodIsStrict$3('reduce');
    // Chrome 80-82 has a critical bug
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
    var CHROME_BUG$1 = !IS_NODE$5 && CHROME_VERSION$1 > 79 && CHROME_VERSION$1 < 83;

    // `Array.prototype.reduce` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduce
    $$Y({ target: 'Array', proto: true, forced: !STRICT_METHOD$3 || CHROME_BUG$1 }, {
      reduce: function reduce(callbackfn /* , initialValue */) {
        var length = arguments.length;
        return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
      }
    });

    var $$X = _export;
    var $reduceRight = arrayReduce.right;
    var arrayMethodIsStrict$2 = arrayMethodIsStrict$6;
    var CHROME_VERSION = engineV8Version;
    var IS_NODE$4 = engineIsNode;

    var STRICT_METHOD$2 = arrayMethodIsStrict$2('reduceRight');
    // Chrome 80-82 has a critical bug
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
    var CHROME_BUG = !IS_NODE$4 && CHROME_VERSION > 79 && CHROME_VERSION < 83;

    // `Array.prototype.reduceRight` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduceright
    $$X({ target: 'Array', proto: true, forced: !STRICT_METHOD$2 || CHROME_BUG }, {
      reduceRight: function reduceRight(callbackfn /* , initialValue */) {
        return $reduceRight(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
      }
    });

    var $$W = _export;
    var isArray = isArray$4;
    var isConstructor$1 = isConstructor$4;
    var isObject$a = isObject$k;
    var toAbsoluteIndex = toAbsoluteIndex$3;
    var lengthOfArrayLike$2 = lengthOfArrayLike$9;
    var toIndexedObject$2 = toIndexedObject$c;
    var createProperty$1 = createProperty$5;
    var wellKnownSymbol$9 = wellKnownSymbol$q;
    var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$4;
    var nativeSlice = arraySlice$6;

    var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

    var SPECIES$4 = wellKnownSymbol$9('species');
    var $Array = Array;
    var max$1 = Math.max;

    // `Array.prototype.slice` method
    // https://tc39.es/ecma262/#sec-array.prototype.slice
    // fallback for not array-like ES3 strings and DOM objects
    $$W({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
      slice: function slice(start, end) {
        var O = toIndexedObject$2(this);
        var length = lengthOfArrayLike$2(O);
        var k = toAbsoluteIndex(start, length);
        var fin = toAbsoluteIndex(end === undefined ? length : end, length);
        // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
        var Constructor, result, n;
        if (isArray(O)) {
          Constructor = O.constructor;
          // cross-realm fallback
          if (isConstructor$1(Constructor) && (Constructor === $Array || isArray(Constructor.prototype))) {
            Constructor = undefined;
          } else if (isObject$a(Constructor)) {
            Constructor = Constructor[SPECIES$4];
            if (Constructor === null) Constructor = undefined;
          }
          if (Constructor === $Array || Constructor === undefined) {
            return nativeSlice(O, k, fin);
          }
        }
        result = new (Constructor === undefined ? $Array : Constructor)(max$1(fin - k, 0));
        for (n = 0; k < fin; k++, n++) if (k in O) createProperty$1(result, n, O[k]);
        result.length = n;
        return result;
      }
    });

    var tryToString$2 = tryToString$6;

    var $TypeError$a = TypeError;

    var deletePropertyOrThrow$1 = function (O, P) {
      if (!delete O[P]) throw $TypeError$a('Cannot delete property ' + tryToString$2(P) + ' of ' + tryToString$2(O));
    };

    var arraySlice$4 = arraySliceSimple;

    var floor$1 = Math.floor;

    var mergeSort = function (array, comparefn) {
      var length = array.length;
      var middle = floor$1(length / 2);
      return length < 8 ? insertionSort(array, comparefn) : merge(
        array,
        mergeSort(arraySlice$4(array, 0, middle), comparefn),
        mergeSort(arraySlice$4(array, middle), comparefn),
        comparefn
      );
    };

    var insertionSort = function (array, comparefn) {
      var length = array.length;
      var i = 1;
      var element, j;

      while (i < length) {
        j = i;
        element = array[i];
        while (j && comparefn(array[j - 1], element) > 0) {
          array[j] = array[--j];
        }
        if (j !== i++) array[j] = element;
      } return array;
    };

    var merge = function (array, left, right, comparefn) {
      var llength = left.length;
      var rlength = right.length;
      var lindex = 0;
      var rindex = 0;

      while (lindex < llength || rindex < rlength) {
        array[lindex + rindex] = (lindex < llength && rindex < rlength)
          ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
          : lindex < llength ? left[lindex++] : right[rindex++];
      } return array;
    };

    var arraySort = mergeSort;

    var userAgent$4 = engineUserAgent;

    var firefox = userAgent$4.match(/firefox\/(\d+)/i);

    var engineFfVersion = !!firefox && +firefox[1];

    var UA = engineUserAgent;

    var engineIsIeOrEdge = /MSIE|Trident/.test(UA);

    var userAgent$3 = engineUserAgent;

    var webkit = userAgent$3.match(/AppleWebKit\/(\d+)\./);

    var engineWebkitVersion = !!webkit && +webkit[1];

    var $$V = _export;
    var uncurryThis$l = functionUncurryThis;
    var aCallable$n = aCallable$s;
    var toObject$5 = toObject$d;
    var lengthOfArrayLike$1 = lengthOfArrayLike$9;
    var deletePropertyOrThrow = deletePropertyOrThrow$1;
    var toString$c = toString$f;
    var fails$m = fails$G;
    var internalSort = arraySort;
    var arrayMethodIsStrict$1 = arrayMethodIsStrict$6;
    var FF = engineFfVersion;
    var IE_OR_EDGE = engineIsIeOrEdge;
    var V8 = engineV8Version;
    var WEBKIT = engineWebkitVersion;

    var test = [];
    var nativeSort = uncurryThis$l(test.sort);
    var push$5 = uncurryThis$l(test.push);

    // IE8-
    var FAILS_ON_UNDEFINED = fails$m(function () {
      test.sort(undefined);
    });
    // V8 bug
    var FAILS_ON_NULL = fails$m(function () {
      test.sort(null);
    });
    // Old WebKit
    var STRICT_METHOD$1 = arrayMethodIsStrict$1('sort');

    var STABLE_SORT = !fails$m(function () {
      // feature detection can be too slow, so check engines versions
      if (V8) return V8 < 70;
      if (FF && FF > 3) return;
      if (IE_OR_EDGE) return true;
      if (WEBKIT) return WEBKIT < 603;

      var result = '';
      var code, chr, value, index;

      // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
      for (code = 65; code < 76; code++) {
        chr = String.fromCharCode(code);

        switch (code) {
          case 66: case 69: case 70: case 72: value = 3; break;
          case 68: case 71: value = 4; break;
          default: value = 2;
        }

        for (index = 0; index < 47; index++) {
          test.push({ k: chr + index, v: value });
        }
      }

      test.sort(function (a, b) { return b.v - a.v; });

      for (index = 0; index < test.length; index++) {
        chr = test[index].k.charAt(0);
        if (result.charAt(result.length - 1) !== chr) result += chr;
      }

      return result !== 'DGBEFHACIJK';
    });

    var FORCED$3 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD$1 || !STABLE_SORT;

    var getSortCompare = function (comparefn) {
      return function (x, y) {
        if (y === undefined) return -1;
        if (x === undefined) return 1;
        if (comparefn !== undefined) return +comparefn(x, y) || 0;
        return toString$c(x) > toString$c(y) ? 1 : -1;
      };
    };

    // `Array.prototype.sort` method
    // https://tc39.es/ecma262/#sec-array.prototype.sort
    $$V({ target: 'Array', proto: true, forced: FORCED$3 }, {
      sort: function sort(comparefn) {
        if (comparefn !== undefined) aCallable$n(comparefn);

        var array = toObject$5(this);

        if (STABLE_SORT) return comparefn === undefined ? nativeSort(array) : nativeSort(array, comparefn);

        var items = [];
        var arrayLength = lengthOfArrayLike$1(array);
        var itemsLength, index;

        for (index = 0; index < arrayLength; index++) {
          if (index in array) push$5(items, array[index]);
        }

        internalSort(items, getSortCompare(comparefn));

        itemsLength = lengthOfArrayLike$1(items);
        index = 0;

        while (index < itemsLength) array[index] = items[index++];
        while (index < arrayLength) deletePropertyOrThrow(array, index++);

        return array;
      }
    });

    var $$U = _export;
    var fails$l = fails$G;
    var toObject$4 = toObject$d;
    var toPrimitive$1 = toPrimitive$3;

    var FORCED$2 = fails$l(function () {
      return new Date(NaN).toJSON() !== null
        || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
    });

    // `Date.prototype.toJSON` method
    // https://tc39.es/ecma262/#sec-date.prototype.tojson
    $$U({ target: 'Date', proto: true, arity: 1, forced: FORCED$2 }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      toJSON: function toJSON(key) {
        var O = toObject$4(this);
        var pv = toPrimitive$1(O, 'number');
        return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
      }
    });

    // TODO: Remove from `core-js@4`
    var uncurryThis$k = functionUncurryThis;
    var defineBuiltIn$9 = defineBuiltIn$f;

    var DatePrototype = Date.prototype;
    var INVALID_DATE = 'Invalid Date';
    var TO_STRING$1 = 'toString';
    var nativeDateToString = uncurryThis$k(DatePrototype[TO_STRING$1]);
    var thisTimeValue = uncurryThis$k(DatePrototype.getTime);

    // `Date.prototype.toString` method
    // https://tc39.es/ecma262/#sec-date.prototype.tostring
    if (String(new Date(NaN)) != INVALID_DATE) {
      defineBuiltIn$9(DatePrototype, TO_STRING$1, function toString() {
        var value = thisTimeValue(this);
        // eslint-disable-next-line no-self-compare -- NaN check
        return value === value ? nativeDateToString(this) : INVALID_DATE;
      });
    }

    var DESCRIPTORS$7 = descriptors;
    var FUNCTION_NAME_EXISTS = functionName.EXISTS;
    var uncurryThis$j = functionUncurryThis;
    var defineProperty$5 = objectDefineProperty.f;

    var FunctionPrototype = Function.prototype;
    var functionToString = uncurryThis$j(FunctionPrototype.toString);
    var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
    var regExpExec$2 = uncurryThis$j(nameRE.exec);
    var NAME = 'name';

    // Function instances `.name` property
    // https://tc39.es/ecma262/#sec-function-instances-name
    if (DESCRIPTORS$7 && !FUNCTION_NAME_EXISTS) {
      defineProperty$5(FunctionPrototype, NAME, {
        configurable: true,
        get: function () {
          try {
            return regExpExec$2(nameRE, functionToString(this))[1];
          } catch (error) {
            return '';
          }
        }
      });
    }

    var DESCRIPTORS$6 = descriptors;
    var uncurryThis$i = functionUncurryThis;
    var call$s = functionCall;
    var fails$k = fails$G;
    var objectKeys$1 = objectKeys$4;
    var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
    var propertyIsEnumerableModule = objectPropertyIsEnumerable;
    var toObject$3 = toObject$d;
    var IndexedObject = indexedObject;

    // eslint-disable-next-line es/no-object-assign -- safe
    var $assign = Object.assign;
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    var defineProperty$4 = Object.defineProperty;
    var concat$2 = uncurryThis$i([].concat);

    // `Object.assign` method
    // https://tc39.es/ecma262/#sec-object.assign
    var objectAssign = !$assign || fails$k(function () {
      // should have correct order of operations (Edge bug)
      if (DESCRIPTORS$6 && $assign({ b: 1 }, $assign(defineProperty$4({}, 'a', {
        enumerable: true,
        get: function () {
          defineProperty$4(this, 'b', {
            value: 3,
            enumerable: false
          });
        }
      }), { b: 2 })).b !== 1) return true;
      // should work with symbols and should have deterministic property order (V8 bug)
      var A = {};
      var B = {};
      // eslint-disable-next-line es/no-symbol -- safe
      var symbol = Symbol();
      var alphabet = 'abcdefghijklmnopqrst';
      A[symbol] = 7;
      alphabet.split('').forEach(function (chr) { B[chr] = chr; });
      return $assign({}, A)[symbol] != 7 || objectKeys$1($assign({}, B)).join('') != alphabet;
    }) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
      var T = toObject$3(target);
      var argumentsLength = arguments.length;
      var index = 1;
      var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
      var propertyIsEnumerable = propertyIsEnumerableModule.f;
      while (argumentsLength > index) {
        var S = IndexedObject(arguments[index++]);
        var keys = getOwnPropertySymbols ? concat$2(objectKeys$1(S), getOwnPropertySymbols(S)) : objectKeys$1(S);
        var length = keys.length;
        var j = 0;
        var key;
        while (length > j) {
          key = keys[j++];
          if (!DESCRIPTORS$6 || call$s(propertyIsEnumerable, S, key)) T[key] = S[key];
        }
      } return T;
    } : $assign;

    var $$T = _export;
    var assign = objectAssign;

    // `Object.assign` method
    // https://tc39.es/ecma262/#sec-object.assign
    // eslint-disable-next-line es/no-object-assign -- required for testing
    $$T({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign }, {
      assign: assign
    });

    var DESCRIPTORS$5 = descriptors;
    var uncurryThis$h = functionUncurryThis;
    var objectKeys = objectKeys$4;
    var toIndexedObject$1 = toIndexedObject$c;
    var $propertyIsEnumerable = objectPropertyIsEnumerable.f;

    var propertyIsEnumerable = uncurryThis$h($propertyIsEnumerable);
    var push$4 = uncurryThis$h([].push);

    // `Object.{ entries, values }` methods implementation
    var createMethod$2 = function (TO_ENTRIES) {
      return function (it) {
        var O = toIndexedObject$1(it);
        var keys = objectKeys(O);
        var length = keys.length;
        var i = 0;
        var result = [];
        var key;
        while (length > i) {
          key = keys[i++];
          if (!DESCRIPTORS$5 || propertyIsEnumerable(O, key)) {
            push$4(result, TO_ENTRIES ? [key, O[key]] : O[key]);
          }
        }
        return result;
      };
    };

    var objectToArray = {
      // `Object.entries` method
      // https://tc39.es/ecma262/#sec-object.entries
      entries: createMethod$2(true),
      // `Object.values` method
      // https://tc39.es/ecma262/#sec-object.values
      values: createMethod$2(false)
    };

    var $$S = _export;
    var $entries = objectToArray.entries;

    // `Object.entries` method
    // https://tc39.es/ecma262/#sec-object.entries
    $$S({ target: 'Object', stat: true }, {
      entries: function entries(O) {
        return $entries(O);
      }
    });

    // `SameValue` abstract operation
    // https://tc39.es/ecma262/#sec-samevalue
    // eslint-disable-next-line es/no-object-is -- safe
    var sameValue = Object.is || function is(x, y) {
      // eslint-disable-next-line no-self-compare -- NaN check
      return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
    };

    var $$R = _export;
    var is = sameValue;

    // `Object.is` method
    // https://tc39.es/ecma262/#sec-object.is
    $$R({ target: 'Object', stat: true }, {
      is: is
    });

    var $$Q = _export;
    var toObject$2 = toObject$d;
    var nativeKeys = objectKeys$4;
    var fails$j = fails$G;

    var FAILS_ON_PRIMITIVES$3 = fails$j(function () { nativeKeys(1); });

    // `Object.keys` method
    // https://tc39.es/ecma262/#sec-object.keys
    $$Q({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3 }, {
      keys: function keys(it) {
        return nativeKeys(toObject$2(it));
      }
    });

    var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
    var classof$3 = classof$a;

    // `Object.prototype.toString` method implementation
    // https://tc39.es/ecma262/#sec-object.prototype.tostring
    var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
      return '[object ' + classof$3(this) + ']';
    };

    var TO_STRING_TAG_SUPPORT = toStringTagSupport;
    var defineBuiltIn$8 = defineBuiltIn$f;
    var toString$b = objectToString;

    // `Object.prototype.toString` method
    // https://tc39.es/ecma262/#sec-object.prototype.tostring
    if (!TO_STRING_TAG_SUPPORT) {
      defineBuiltIn$8(Object.prototype, 'toString', toString$b, { unsafe: true });
    }

    var $$P = _export;
    var $values = objectToArray.values;

    // `Object.values` method
    // https://tc39.es/ecma262/#sec-object.values
    $$P({ target: 'Object', stat: true }, {
      values: function values(O) {
        return $values(O);
      }
    });

    var anObject$B = anObject$L;

    // `RegExp.prototype.flags` getter implementation
    // https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
    var regexpFlags$1 = function () {
      var that = anObject$B(this);
      var result = '';
      if (that.hasIndices) result += 'd';
      if (that.global) result += 'g';
      if (that.ignoreCase) result += 'i';
      if (that.multiline) result += 'm';
      if (that.dotAll) result += 's';
      if (that.unicode) result += 'u';
      if (that.unicodeSets) result += 'v';
      if (that.sticky) result += 'y';
      return result;
    };

    var fails$i = fails$G;
    var global$g = global$u;

    // babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
    var $RegExp$2 = global$g.RegExp;

    var UNSUPPORTED_Y$3 = fails$i(function () {
      var re = $RegExp$2('a', 'y');
      re.lastIndex = 2;
      return re.exec('abcd') != null;
    });

    // UC Browser bug
    // https://github.com/zloirock/core-js/issues/1008
    var MISSED_STICKY$1 = UNSUPPORTED_Y$3 || fails$i(function () {
      return !$RegExp$2('a', 'y').sticky;
    });

    var BROKEN_CARET = UNSUPPORTED_Y$3 || fails$i(function () {
      // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
      var re = $RegExp$2('^r', 'gy');
      re.lastIndex = 2;
      return re.exec('str') != null;
    });

    var regexpStickyHelpers = {
      BROKEN_CARET: BROKEN_CARET,
      MISSED_STICKY: MISSED_STICKY$1,
      UNSUPPORTED_Y: UNSUPPORTED_Y$3
    };

    var fails$h = fails$G;
    var global$f = global$u;

    // babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
    var $RegExp$1 = global$f.RegExp;

    var regexpUnsupportedDotAll = fails$h(function () {
      var re = $RegExp$1('.', 's');
      return !(re.dotAll && re.exec('\n') && re.flags === 's');
    });

    var fails$g = fails$G;
    var global$e = global$u;

    // babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
    var $RegExp = global$e.RegExp;

    var regexpUnsupportedNcg = fails$g(function () {
      var re = $RegExp('(?<a>b)', 'g');
      return re.exec('b').groups.a !== 'b' ||
        'b'.replace(re, '$<a>c') !== 'bc';
    });

    /* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
    /* eslint-disable regexp/no-useless-quantifier -- testing */
    var call$r = functionCall;
    var uncurryThis$g = functionUncurryThis;
    var toString$a = toString$f;
    var regexpFlags = regexpFlags$1;
    var stickyHelpers$2 = regexpStickyHelpers;
    var shared = shared$7.exports;
    var create$2 = objectCreate;
    var getInternalState$1 = internalState.get;
    var UNSUPPORTED_DOT_ALL$1 = regexpUnsupportedDotAll;
    var UNSUPPORTED_NCG$1 = regexpUnsupportedNcg;

    var nativeReplace = shared('native-string-replace', String.prototype.replace);
    var nativeExec = RegExp.prototype.exec;
    var patchedExec = nativeExec;
    var charAt$6 = uncurryThis$g(''.charAt);
    var indexOf = uncurryThis$g(''.indexOf);
    var replace$3 = uncurryThis$g(''.replace);
    var stringSlice$5 = uncurryThis$g(''.slice);

    var UPDATES_LAST_INDEX_WRONG = (function () {
      var re1 = /a/;
      var re2 = /b*/g;
      call$r(nativeExec, re1, 'a');
      call$r(nativeExec, re2, 'a');
      return re1.lastIndex !== 0 || re2.lastIndex !== 0;
    })();

    var UNSUPPORTED_Y$2 = stickyHelpers$2.BROKEN_CARET;

    // nonparticipating capturing group, copied from es5-shim's String#split patch.
    var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

    var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$2 || UNSUPPORTED_DOT_ALL$1 || UNSUPPORTED_NCG$1;

    if (PATCH) {
      patchedExec = function exec(string) {
        var re = this;
        var state = getInternalState$1(re);
        var str = toString$a(string);
        var raw = state.raw;
        var result, reCopy, lastIndex, match, i, object, group;

        if (raw) {
          raw.lastIndex = re.lastIndex;
          result = call$r(patchedExec, raw, str);
          re.lastIndex = raw.lastIndex;
          return result;
        }

        var groups = state.groups;
        var sticky = UNSUPPORTED_Y$2 && re.sticky;
        var flags = call$r(regexpFlags, re);
        var source = re.source;
        var charsAdded = 0;
        var strCopy = str;

        if (sticky) {
          flags = replace$3(flags, 'y', '');
          if (indexOf(flags, 'g') === -1) {
            flags += 'g';
          }

          strCopy = stringSlice$5(str, re.lastIndex);
          // Support anchored sticky behavior.
          if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$6(str, re.lastIndex - 1) !== '\n')) {
            source = '(?: ' + source + ')';
            strCopy = ' ' + strCopy;
            charsAdded++;
          }
          // ^(? + rx + ) is needed, in combination with some str slicing, to
          // simulate the 'y' flag.
          reCopy = new RegExp('^(?:' + source + ')', flags);
        }

        if (NPCG_INCLUDED) {
          reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
        }
        if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

        match = call$r(nativeExec, sticky ? reCopy : re, strCopy);

        if (sticky) {
          if (match) {
            match.input = stringSlice$5(match.input, charsAdded);
            match[0] = stringSlice$5(match[0], charsAdded);
            match.index = re.lastIndex;
            re.lastIndex += match[0].length;
          } else re.lastIndex = 0;
        } else if (UPDATES_LAST_INDEX_WRONG && match) {
          re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
        }
        if (NPCG_INCLUDED && match && match.length > 1) {
          // Fix browsers whose `exec` methods don't consistently return `undefined`
          // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
          call$r(nativeReplace, match[0], reCopy, function () {
            for (i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undefined) match[i] = undefined;
            }
          });
        }

        if (match && groups) {
          match.groups = object = create$2(null);
          for (i = 0; i < groups.length; i++) {
            group = groups[i];
            object[group[0]] = match[group[1]];
          }
        }

        return match;
      };
    }

    var regexpExec$3 = patchedExec;

    var $$O = _export;
    var exec$2 = regexpExec$3;

    // `RegExp.prototype.exec` method
    // https://tc39.es/ecma262/#sec-regexp.prototype.exec
    $$O({ target: 'RegExp', proto: true, forced: /./.exec !== exec$2 }, {
      exec: exec$2
    });

    var call$q = functionCall;
    var hasOwn$5 = hasOwnProperty_1;
    var isPrototypeOf$4 = objectIsPrototypeOf;
    var regExpFlags = regexpFlags$1;

    var RegExpPrototype$3 = RegExp.prototype;

    var regexpGetFlags = function (R) {
      var flags = R.flags;
      return flags === undefined && !('flags' in RegExpPrototype$3) && !hasOwn$5(R, 'flags') && isPrototypeOf$4(RegExpPrototype$3, R)
        ? call$q(regExpFlags, R) : flags;
    };

    var PROPER_FUNCTION_NAME$1 = functionName.PROPER;
    var defineBuiltIn$7 = defineBuiltIn$f;
    var anObject$A = anObject$L;
    var $toString = toString$f;
    var fails$f = fails$G;
    var getRegExpFlags$1 = regexpGetFlags;

    var TO_STRING = 'toString';
    var RegExpPrototype$2 = RegExp.prototype;
    var nativeToString = RegExpPrototype$2[TO_STRING];

    var NOT_GENERIC = fails$f(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
    // FF44- RegExp#toString has a wrong name
    var INCORRECT_NAME = PROPER_FUNCTION_NAME$1 && nativeToString.name != TO_STRING;

    // `RegExp.prototype.toString` method
    // https://tc39.es/ecma262/#sec-regexp.prototype.tostring
    if (NOT_GENERIC || INCORRECT_NAME) {
      defineBuiltIn$7(RegExp.prototype, TO_STRING, function toString() {
        var R = anObject$A(this);
        var pattern = $toString(R.source);
        var flags = $toString(getRegExpFlags$1(R));
        return '/' + pattern + '/' + flags;
      }, { unsafe: true });
    }

    var internalMetadata = {exports: {}};

    // FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it
    var fails$e = fails$G;

    var arrayBufferNonExtensible = fails$e(function () {
      if (typeof ArrayBuffer == 'function') {
        var buffer = new ArrayBuffer(8);
        // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe
        if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
      }
    });

    var fails$d = fails$G;
    var isObject$9 = isObject$k;
    var classof$2 = classofRaw$2;
    var ARRAY_BUFFER_NON_EXTENSIBLE = arrayBufferNonExtensible;

    // eslint-disable-next-line es/no-object-isextensible -- safe
    var $isExtensible = Object.isExtensible;
    var FAILS_ON_PRIMITIVES$2 = fails$d(function () { $isExtensible(1); });

    // `Object.isExtensible` method
    // https://tc39.es/ecma262/#sec-object.isextensible
    var objectIsExtensible = (FAILS_ON_PRIMITIVES$2 || ARRAY_BUFFER_NON_EXTENSIBLE) ? function isExtensible(it) {
      if (!isObject$9(it)) return false;
      if (ARRAY_BUFFER_NON_EXTENSIBLE && classof$2(it) == 'ArrayBuffer') return false;
      return $isExtensible ? $isExtensible(it) : true;
    } : $isExtensible;

    var fails$c = fails$G;

    var freezing = !fails$c(function () {
      // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
      return Object.isExtensible(Object.preventExtensions({}));
    });

    var $$N = _export;
    var uncurryThis$f = functionUncurryThis;
    var hiddenKeys = hiddenKeys$6;
    var isObject$8 = isObject$k;
    var hasOwn$4 = hasOwnProperty_1;
    var defineProperty$3 = objectDefineProperty.f;
    var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
    var getOwnPropertyNamesExternalModule = objectGetOwnPropertyNamesExternal;
    var isExtensible = objectIsExtensible;
    var uid = uid$4;
    var FREEZING$1 = freezing;

    var REQUIRED = false;
    var METADATA = uid('meta');
    var id = 0;

    var setMetadata = function (it) {
      defineProperty$3(it, METADATA, { value: {
        objectID: 'O' + id++, // object ID
        weakData: {}          // weak collections IDs
      } });
    };

    var fastKey$1 = function (it, create) {
      // return a primitive with prefix
      if (!isObject$8(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
      if (!hasOwn$4(it, METADATA)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return 'F';
        // not necessary to add metadata
        if (!create) return 'E';
        // add missing metadata
        setMetadata(it);
      // return object ID
      } return it[METADATA].objectID;
    };

    var getWeakData = function (it, create) {
      if (!hasOwn$4(it, METADATA)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return true;
        // not necessary to add metadata
        if (!create) return false;
        // add missing metadata
        setMetadata(it);
      // return the store of weak collections IDs
      } return it[METADATA].weakData;
    };

    // add metadata on freeze-family methods calling
    var onFreeze$1 = function (it) {
      if (FREEZING$1 && REQUIRED && isExtensible(it) && !hasOwn$4(it, METADATA)) setMetadata(it);
      return it;
    };

    var enable = function () {
      meta.enable = function () { /* empty */ };
      REQUIRED = true;
      var getOwnPropertyNames = getOwnPropertyNamesModule.f;
      var splice = uncurryThis$f([].splice);
      var test = {};
      test[METADATA] = 1;

      // prevent exposing of metadata key
      if (getOwnPropertyNames(test).length) {
        getOwnPropertyNamesModule.f = function (it) {
          var result = getOwnPropertyNames(it);
          for (var i = 0, length = result.length; i < length; i++) {
            if (result[i] === METADATA) {
              splice(result, i, 1);
              break;
            }
          } return result;
        };

        $$N({ target: 'Object', stat: true, forced: true }, {
          getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
        });
      }
    };

    var meta = internalMetadata.exports = {
      enable: enable,
      fastKey: fastKey$1,
      getWeakData: getWeakData,
      onFreeze: onFreeze$1
    };

    hiddenKeys[METADATA] = true;

    var bind$h = functionBindContext;
    var call$p = functionCall;
    var anObject$z = anObject$L;
    var tryToString$1 = tryToString$6;
    var isArrayIteratorMethod = isArrayIteratorMethod$2;
    var lengthOfArrayLike = lengthOfArrayLike$9;
    var isPrototypeOf$3 = objectIsPrototypeOf;
    var getIterator$1 = getIterator$3;
    var getIteratorMethod = getIteratorMethod$3;
    var iteratorClose = iteratorClose$2;

    var $TypeError$9 = TypeError;

    var Result = function (stopped, result) {
      this.stopped = stopped;
      this.result = result;
    };

    var ResultPrototype = Result.prototype;

    var iterate$t = function (iterable, unboundFunction, options) {
      var that = options && options.that;
      var AS_ENTRIES = !!(options && options.AS_ENTRIES);
      var IS_RECORD = !!(options && options.IS_RECORD);
      var IS_ITERATOR = !!(options && options.IS_ITERATOR);
      var INTERRUPTED = !!(options && options.INTERRUPTED);
      var fn = bind$h(unboundFunction, that);
      var iterator, iterFn, index, length, result, next, step;

      var stop = function (condition) {
        if (iterator) iteratorClose(iterator, 'normal', condition);
        return new Result(true, condition);
      };

      var callFn = function (value) {
        if (AS_ENTRIES) {
          anObject$z(value);
          return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
        } return INTERRUPTED ? fn(value, stop) : fn(value);
      };

      if (IS_RECORD) {
        iterator = iterable.iterator;
      } else if (IS_ITERATOR) {
        iterator = iterable;
      } else {
        iterFn = getIteratorMethod(iterable);
        if (!iterFn) throw $TypeError$9(tryToString$1(iterable) + ' is not iterable');
        // optimisation for array iterators
        if (isArrayIteratorMethod(iterFn)) {
          for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
            result = callFn(iterable[index]);
            if (result && isPrototypeOf$3(ResultPrototype, result)) return result;
          } return new Result(false);
        }
        iterator = getIterator$1(iterable, iterFn);
      }

      next = IS_RECORD ? iterable.next : iterator.next;
      while (!(step = call$p(next, iterator)).done) {
        try {
          result = callFn(step.value);
        } catch (error) {
          iteratorClose(iterator, 'throw', error);
        }
        if (typeof result == 'object' && result && isPrototypeOf$3(ResultPrototype, result)) return result;
      } return new Result(false);
    };

    var isPrototypeOf$2 = objectIsPrototypeOf;

    var $TypeError$8 = TypeError;

    var anInstance$3 = function (it, Prototype) {
      if (isPrototypeOf$2(Prototype, it)) return it;
      throw $TypeError$8('Incorrect invocation');
    };

    var isCallable$8 = isCallable$r;
    var isObject$7 = isObject$k;
    var setPrototypeOf$2 = objectSetPrototypeOf;

    // makes subclassing work correct for wrapped built-ins
    var inheritIfRequired$3 = function ($this, dummy, Wrapper) {
      var NewTarget, NewTargetPrototype;
      if (
        // it can work only with native `setPrototypeOf`
        setPrototypeOf$2 &&
        // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
        isCallable$8(NewTarget = dummy.constructor) &&
        NewTarget !== Wrapper &&
        isObject$7(NewTargetPrototype = NewTarget.prototype) &&
        NewTargetPrototype !== Wrapper.prototype
      ) setPrototypeOf$2($this, NewTargetPrototype);
      return $this;
    };

    var $$M = _export;
    var global$d = global$u;
    var uncurryThis$e = functionUncurryThis;
    var isForced$3 = isForced_1;
    var defineBuiltIn$6 = defineBuiltIn$f;
    var InternalMetadataModule = internalMetadata.exports;
    var iterate$s = iterate$t;
    var anInstance$2 = anInstance$3;
    var isCallable$7 = isCallable$r;
    var isNullOrUndefined$5 = isNullOrUndefined$9;
    var isObject$6 = isObject$k;
    var fails$b = fails$G;
    var checkCorrectnessOfIteration$1 = checkCorrectnessOfIteration$3;
    var setToStringTag$1 = setToStringTag$5;
    var inheritIfRequired$2 = inheritIfRequired$3;

    var collection$2 = function (CONSTRUCTOR_NAME, wrapper, common) {
      var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
      var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
      var ADDER = IS_MAP ? 'set' : 'add';
      var NativeConstructor = global$d[CONSTRUCTOR_NAME];
      var NativePrototype = NativeConstructor && NativeConstructor.prototype;
      var Constructor = NativeConstructor;
      var exported = {};

      var fixMethod = function (KEY) {
        var uncurriedNativeMethod = uncurryThis$e(NativePrototype[KEY]);
        defineBuiltIn$6(NativePrototype, KEY,
          KEY == 'add' ? function add(value) {
            uncurriedNativeMethod(this, value === 0 ? 0 : value);
            return this;
          } : KEY == 'delete' ? function (key) {
            return IS_WEAK && !isObject$6(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
          } : KEY == 'get' ? function get(key) {
            return IS_WEAK && !isObject$6(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
          } : KEY == 'has' ? function has(key) {
            return IS_WEAK && !isObject$6(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
          } : function set(key, value) {
            uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
            return this;
          }
        );
      };

      var REPLACE = isForced$3(
        CONSTRUCTOR_NAME,
        !isCallable$7(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails$b(function () {
          new NativeConstructor().entries().next();
        }))
      );

      if (REPLACE) {
        // create collection constructor
        Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
        InternalMetadataModule.enable();
      } else if (isForced$3(CONSTRUCTOR_NAME, true)) {
        var instance = new Constructor();
        // early implementations not supports chaining
        var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
        // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
        var THROWS_ON_PRIMITIVES = fails$b(function () { instance.has(1); });
        // most early implementations doesn't supports iterables, most modern - not close it correctly
        // eslint-disable-next-line no-new -- required for testing
        var ACCEPT_ITERABLES = checkCorrectnessOfIteration$1(function (iterable) { new NativeConstructor(iterable); });
        // for early implementations -0 and +0 not the same
        var BUGGY_ZERO = !IS_WEAK && fails$b(function () {
          // V8 ~ Chromium 42- fails only with 5+ elements
          var $instance = new NativeConstructor();
          var index = 5;
          while (index--) $instance[ADDER](index, index);
          return !$instance.has(-0);
        });

        if (!ACCEPT_ITERABLES) {
          Constructor = wrapper(function (dummy, iterable) {
            anInstance$2(dummy, NativePrototype);
            var that = inheritIfRequired$2(new NativeConstructor(), dummy, Constructor);
            if (!isNullOrUndefined$5(iterable)) iterate$s(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
            return that;
          });
          Constructor.prototype = NativePrototype;
          NativePrototype.constructor = Constructor;
        }

        if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
          fixMethod('delete');
          fixMethod('has');
          IS_MAP && fixMethod('get');
        }

        if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

        // weak collections should not contains .clear method
        if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
      }

      exported[CONSTRUCTOR_NAME] = Constructor;
      $$M({ global: true, constructor: true, forced: Constructor != NativeConstructor }, exported);

      setToStringTag$1(Constructor, CONSTRUCTOR_NAME);

      if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

      return Constructor;
    };

    var defineBuiltIn$5 = defineBuiltIn$f;

    var defineBuiltIns$1 = function (target, src, options) {
      for (var key in src) defineBuiltIn$5(target, key, src[key], options);
      return target;
    };

    var getBuiltIn$d = getBuiltIn$m;
    var definePropertyModule = objectDefineProperty;
    var wellKnownSymbol$8 = wellKnownSymbol$q;
    var DESCRIPTORS$4 = descriptors;

    var SPECIES$3 = wellKnownSymbol$8('species');

    var setSpecies$3 = function (CONSTRUCTOR_NAME) {
      var Constructor = getBuiltIn$d(CONSTRUCTOR_NAME);
      var defineProperty = definePropertyModule.f;

      if (DESCRIPTORS$4 && Constructor && !Constructor[SPECIES$3]) {
        defineProperty(Constructor, SPECIES$3, {
          configurable: true,
          get: function () { return this; }
        });
      }
    };

    var defineProperty$2 = objectDefineProperty.f;
    var create$1 = objectCreate;
    var defineBuiltIns = defineBuiltIns$1;
    var bind$g = functionBindContext;
    var anInstance$1 = anInstance$3;
    var isNullOrUndefined$4 = isNullOrUndefined$9;
    var iterate$r = iterate$t;
    var defineIterator$1 = iteratorDefine;
    var createIterResultObject$1 = createIterResultObject$3;
    var setSpecies$2 = setSpecies$3;
    var DESCRIPTORS$3 = descriptors;
    var fastKey = internalMetadata.exports.fastKey;
    var InternalStateModule$2 = internalState;

    var setInternalState$2 = InternalStateModule$2.set;
    var internalStateGetterFor = InternalStateModule$2.getterFor;

    var collectionStrong$2 = {
      getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
        var Constructor = wrapper(function (that, iterable) {
          anInstance$1(that, Prototype);
          setInternalState$2(that, {
            type: CONSTRUCTOR_NAME,
            index: create$1(null),
            first: undefined,
            last: undefined,
            size: 0
          });
          if (!DESCRIPTORS$3) that.size = 0;
          if (!isNullOrUndefined$4(iterable)) iterate$r(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
        });

        var Prototype = Constructor.prototype;

        var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

        var define = function (that, key, value) {
          var state = getInternalState(that);
          var entry = getEntry(that, key);
          var previous, index;
          // change existing entry
          if (entry) {
            entry.value = value;
          // create new entry
          } else {
            state.last = entry = {
              index: index = fastKey(key, true),
              key: key,
              value: value,
              previous: previous = state.last,
              next: undefined,
              removed: false
            };
            if (!state.first) state.first = entry;
            if (previous) previous.next = entry;
            if (DESCRIPTORS$3) state.size++;
            else that.size++;
            // add to index
            if (index !== 'F') state.index[index] = entry;
          } return that;
        };

        var getEntry = function (that, key) {
          var state = getInternalState(that);
          // fast case
          var index = fastKey(key);
          var entry;
          if (index !== 'F') return state.index[index];
          // frozen object case
          for (entry = state.first; entry; entry = entry.next) {
            if (entry.key == key) return entry;
          }
        };

        defineBuiltIns(Prototype, {
          // `{ Map, Set }.prototype.clear()` methods
          // https://tc39.es/ecma262/#sec-map.prototype.clear
          // https://tc39.es/ecma262/#sec-set.prototype.clear
          clear: function clear() {
            var that = this;
            var state = getInternalState(that);
            var data = state.index;
            var entry = state.first;
            while (entry) {
              entry.removed = true;
              if (entry.previous) entry.previous = entry.previous.next = undefined;
              delete data[entry.index];
              entry = entry.next;
            }
            state.first = state.last = undefined;
            if (DESCRIPTORS$3) state.size = 0;
            else that.size = 0;
          },
          // `{ Map, Set }.prototype.delete(key)` methods
          // https://tc39.es/ecma262/#sec-map.prototype.delete
          // https://tc39.es/ecma262/#sec-set.prototype.delete
          'delete': function (key) {
            var that = this;
            var state = getInternalState(that);
            var entry = getEntry(that, key);
            if (entry) {
              var next = entry.next;
              var prev = entry.previous;
              delete state.index[entry.index];
              entry.removed = true;
              if (prev) prev.next = next;
              if (next) next.previous = prev;
              if (state.first == entry) state.first = next;
              if (state.last == entry) state.last = prev;
              if (DESCRIPTORS$3) state.size--;
              else that.size--;
            } return !!entry;
          },
          // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
          // https://tc39.es/ecma262/#sec-map.prototype.foreach
          // https://tc39.es/ecma262/#sec-set.prototype.foreach
          forEach: function forEach(callbackfn /* , that = undefined */) {
            var state = getInternalState(this);
            var boundFunction = bind$g(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
            var entry;
            while (entry = entry ? entry.next : state.first) {
              boundFunction(entry.value, entry.key, this);
              // revert to the last existing entry
              while (entry && entry.removed) entry = entry.previous;
            }
          },
          // `{ Map, Set}.prototype.has(key)` methods
          // https://tc39.es/ecma262/#sec-map.prototype.has
          // https://tc39.es/ecma262/#sec-set.prototype.has
          has: function has(key) {
            return !!getEntry(this, key);
          }
        });

        defineBuiltIns(Prototype, IS_MAP ? {
          // `Map.prototype.get(key)` method
          // https://tc39.es/ecma262/#sec-map.prototype.get
          get: function get(key) {
            var entry = getEntry(this, key);
            return entry && entry.value;
          },
          // `Map.prototype.set(key, value)` method
          // https://tc39.es/ecma262/#sec-map.prototype.set
          set: function set(key, value) {
            return define(this, key === 0 ? 0 : key, value);
          }
        } : {
          // `Set.prototype.add(value)` method
          // https://tc39.es/ecma262/#sec-set.prototype.add
          add: function add(value) {
            return define(this, value = value === 0 ? 0 : value, value);
          }
        });
        if (DESCRIPTORS$3) defineProperty$2(Prototype, 'size', {
          get: function () {
            return getInternalState(this).size;
          }
        });
        return Constructor;
      },
      setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
        var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
        var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
        var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
        // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
        // https://tc39.es/ecma262/#sec-map.prototype.entries
        // https://tc39.es/ecma262/#sec-map.prototype.keys
        // https://tc39.es/ecma262/#sec-map.prototype.values
        // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
        // https://tc39.es/ecma262/#sec-set.prototype.entries
        // https://tc39.es/ecma262/#sec-set.prototype.keys
        // https://tc39.es/ecma262/#sec-set.prototype.values
        // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
        defineIterator$1(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
          setInternalState$2(this, {
            type: ITERATOR_NAME,
            target: iterated,
            state: getInternalCollectionState(iterated),
            kind: kind,
            last: undefined
          });
        }, function () {
          var state = getInternalIteratorState(this);
          var kind = state.kind;
          var entry = state.last;
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
          // get next entry
          if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
            // or finish the iteration
            state.target = undefined;
            return createIterResultObject$1(undefined, true);
          }
          // return step by kind
          if (kind == 'keys') return createIterResultObject$1(entry.key, false);
          if (kind == 'values') return createIterResultObject$1(entry.value, false);
          return createIterResultObject$1([entry.key, entry.value], false);
        }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

        // `{ Map, Set }.prototype[@@species]` accessors
        // https://tc39.es/ecma262/#sec-get-map-@@species
        // https://tc39.es/ecma262/#sec-get-set-@@species
        setSpecies$2(CONSTRUCTOR_NAME);
      }
    };

    var collection$1 = collection$2;
    var collectionStrong$1 = collectionStrong$2;

    // `Set` constructor
    // https://tc39.es/ecma262/#sec-set-objects
    collection$1('Set', function (init) {
      return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
    }, collectionStrong$1);

    var isObject$5 = isObject$k;
    var classof$1 = classofRaw$2;
    var wellKnownSymbol$7 = wellKnownSymbol$q;

    var MATCH$2 = wellKnownSymbol$7('match');

    // `IsRegExp` abstract operation
    // https://tc39.es/ecma262/#sec-isregexp
    var isRegexp = function (it) {
      var isRegExp;
      return isObject$5(it) && ((isRegExp = it[MATCH$2]) !== undefined ? !!isRegExp : classof$1(it) == 'RegExp');
    };

    var isRegExp$2 = isRegexp;

    var $TypeError$7 = TypeError;

    var notARegexp = function (it) {
      if (isRegExp$2(it)) {
        throw $TypeError$7("The method doesn't accept regular expressions");
      } return it;
    };

    var wellKnownSymbol$6 = wellKnownSymbol$q;

    var MATCH$1 = wellKnownSymbol$6('match');

    var correctIsRegexpLogic = function (METHOD_NAME) {
      var regexp = /./;
      try {
        '/./'[METHOD_NAME](regexp);
      } catch (error1) {
        try {
          regexp[MATCH$1] = false;
          return '/./'[METHOD_NAME](regexp);
        } catch (error2) { /* empty */ }
      } return false;
    };

    var $$L = _export;
    var uncurryThis$d = functionUncurryThis;
    var notARegExp = notARegexp;
    var requireObjectCoercible$5 = requireObjectCoercible$8;
    var toString$9 = toString$f;
    var correctIsRegExpLogic = correctIsRegexpLogic;

    var stringIndexOf$2 = uncurryThis$d(''.indexOf);

    // `String.prototype.includes` method
    // https://tc39.es/ecma262/#sec-string.prototype.includes
    $$L({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
      includes: function includes(searchString /* , position = 0 */) {
        return !!~stringIndexOf$2(
          toString$9(requireObjectCoercible$5(this)),
          toString$9(notARegExp(searchString)),
          arguments.length > 1 ? arguments[1] : undefined
        );
      }
    });

    var uncurryThis$c = functionUncurryThis;
    var toIntegerOrInfinity$1 = toIntegerOrInfinity$4;
    var toString$8 = toString$f;
    var requireObjectCoercible$4 = requireObjectCoercible$8;

    var charAt$5 = uncurryThis$c(''.charAt);
    var charCodeAt$1 = uncurryThis$c(''.charCodeAt);
    var stringSlice$4 = uncurryThis$c(''.slice);

    var createMethod$1 = function (CONVERT_TO_STRING) {
      return function ($this, pos) {
        var S = toString$8(requireObjectCoercible$4($this));
        var position = toIntegerOrInfinity$1(pos);
        var size = S.length;
        var first, second;
        if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
        first = charCodeAt$1(S, position);
        return first < 0xD800 || first > 0xDBFF || position + 1 === size
          || (second = charCodeAt$1(S, position + 1)) < 0xDC00 || second > 0xDFFF
            ? CONVERT_TO_STRING
              ? charAt$5(S, position)
              : first
            : CONVERT_TO_STRING
              ? stringSlice$4(S, position, position + 2)
              : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
      };
    };

    var stringMultibyte = {
      // `String.prototype.codePointAt` method
      // https://tc39.es/ecma262/#sec-string.prototype.codepointat
      codeAt: createMethod$1(false),
      // `String.prototype.at` method
      // https://github.com/mathiasbynens/String.prototype.at
      charAt: createMethod$1(true)
    };

    var charAt$4 = stringMultibyte.charAt;
    var toString$7 = toString$f;
    var InternalStateModule$1 = internalState;
    var defineIterator = iteratorDefine;
    var createIterResultObject = createIterResultObject$3;

    var STRING_ITERATOR = 'String Iterator';
    var setInternalState$1 = InternalStateModule$1.set;
    var getInternalState = InternalStateModule$1.getterFor(STRING_ITERATOR);

    // `String.prototype[@@iterator]` method
    // https://tc39.es/ecma262/#sec-string.prototype-@@iterator
    defineIterator(String, 'String', function (iterated) {
      setInternalState$1(this, {
        type: STRING_ITERATOR,
        string: toString$7(iterated),
        index: 0
      });
    // `%StringIteratorPrototype%.next` method
    // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
    }, function next() {
      var state = getInternalState(this);
      var string = state.string;
      var index = state.index;
      var point;
      if (index >= string.length) return createIterResultObject(undefined, true);
      point = charAt$4(string, index);
      state.index += point.length;
      return createIterResultObject(point, false);
    });

    // TODO: Remove from `core-js@4` since it's moved to entry points

    var uncurryThis$b = functionUncurryThisClause;
    var defineBuiltIn$4 = defineBuiltIn$f;
    var regexpExec$2 = regexpExec$3;
    var fails$a = fails$G;
    var wellKnownSymbol$5 = wellKnownSymbol$q;
    var createNonEnumerableProperty$3 = createNonEnumerableProperty$7;

    var SPECIES$2 = wellKnownSymbol$5('species');
    var RegExpPrototype$1 = RegExp.prototype;

    var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
      var SYMBOL = wellKnownSymbol$5(KEY);

      var DELEGATES_TO_SYMBOL = !fails$a(function () {
        // String methods call symbol-named RegEp methods
        var O = {};
        O[SYMBOL] = function () { return 7; };
        return ''[KEY](O) != 7;
      });

      var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$a(function () {
        // Symbol-named RegExp methods call .exec
        var execCalled = false;
        var re = /a/;

        if (KEY === 'split') {
          // We can't use real regex here since it causes deoptimization
          // and serious performance degradation in V8
          // https://github.com/zloirock/core-js/issues/306
          re = {};
          // RegExp[@@split] doesn't call the regex's exec method, but first creates
          // a new one. We need to return the patched regex when creating the new one.
          re.constructor = {};
          re.constructor[SPECIES$2] = function () { return re; };
          re.flags = '';
          re[SYMBOL] = /./[SYMBOL];
        }

        re.exec = function () { execCalled = true; return null; };

        re[SYMBOL]('');
        return !execCalled;
      });

      if (
        !DELEGATES_TO_SYMBOL ||
        !DELEGATES_TO_EXEC ||
        FORCED
      ) {
        var uncurriedNativeRegExpMethod = uncurryThis$b(/./[SYMBOL]);
        var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
          var uncurriedNativeMethod = uncurryThis$b(nativeMethod);
          var $exec = regexp.exec;
          if ($exec === regexpExec$2 || $exec === RegExpPrototype$1.exec) {
            if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
              // The native String method already delegates to @@method (this
              // polyfilled function), leasing to infinite recursion.
              // We avoid it by directly calling the native @@method method.
              return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
            }
            return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
          }
          return { done: false };
        });

        defineBuiltIn$4(String.prototype, KEY, methods[0]);
        defineBuiltIn$4(RegExpPrototype$1, SYMBOL, methods[1]);
      }

      if (SHAM) createNonEnumerableProperty$3(RegExpPrototype$1[SYMBOL], 'sham', true);
    };

    var charAt$3 = stringMultibyte.charAt;

    // `AdvanceStringIndex` abstract operation
    // https://tc39.es/ecma262/#sec-advancestringindex
    var advanceStringIndex$3 = function (S, index, unicode) {
      return index + (unicode ? charAt$3(S, index).length : 1);
    };

    var uncurryThis$a = functionUncurryThis;
    var toObject$1 = toObject$d;

    var floor = Math.floor;
    var charAt$2 = uncurryThis$a(''.charAt);
    var replace$2 = uncurryThis$a(''.replace);
    var stringSlice$3 = uncurryThis$a(''.slice);
    var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
    var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

    // `GetSubstitution` abstract operation
    // https://tc39.es/ecma262/#sec-getsubstitution
    var getSubstitution$1 = function (matched, str, position, captures, namedCaptures, replacement) {
      var tailPos = position + matched.length;
      var m = captures.length;
      var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
      if (namedCaptures !== undefined) {
        namedCaptures = toObject$1(namedCaptures);
        symbols = SUBSTITUTION_SYMBOLS;
      }
      return replace$2(replacement, symbols, function (match, ch) {
        var capture;
        switch (charAt$2(ch, 0)) {
          case '$': return '$';
          case '&': return matched;
          case '`': return stringSlice$3(str, 0, position);
          case "'": return stringSlice$3(str, tailPos);
          case '<':
            capture = namedCaptures[stringSlice$3(ch, 1, -1)];
            break;
          default: // \d\d?
            var n = +ch;
            if (n === 0) return match;
            if (n > m) {
              var f = floor(n / 10);
              if (f === 0) return match;
              if (f <= m) return captures[f - 1] === undefined ? charAt$2(ch, 1) : captures[f - 1] + charAt$2(ch, 1);
              return match;
            }
            capture = captures[n - 1];
        }
        return capture === undefined ? '' : capture;
      });
    };

    var call$o = functionCall;
    var anObject$y = anObject$L;
    var isCallable$6 = isCallable$r;
    var classof = classofRaw$2;
    var regexpExec$1 = regexpExec$3;

    var $TypeError$6 = TypeError;

    // `RegExpExec` abstract operation
    // https://tc39.es/ecma262/#sec-regexpexec
    var regexpExecAbstract = function (R, S) {
      var exec = R.exec;
      if (isCallable$6(exec)) {
        var result = call$o(exec, R, S);
        if (result !== null) anObject$y(result);
        return result;
      }
      if (classof(R) === 'RegExp') return call$o(regexpExec$1, R, S);
      throw $TypeError$6('RegExp#exec called on incompatible receiver');
    };

    var apply$3 = functionApply;
    var call$n = functionCall;
    var uncurryThis$9 = functionUncurryThis;
    var fixRegExpWellKnownSymbolLogic$2 = fixRegexpWellKnownSymbolLogic;
    var fails$9 = fails$G;
    var anObject$x = anObject$L;
    var isCallable$5 = isCallable$r;
    var isNullOrUndefined$3 = isNullOrUndefined$9;
    var toIntegerOrInfinity = toIntegerOrInfinity$4;
    var toLength$2 = toLength$4;
    var toString$6 = toString$f;
    var requireObjectCoercible$3 = requireObjectCoercible$8;
    var advanceStringIndex$2 = advanceStringIndex$3;
    var getMethod$2 = getMethod$6;
    var getSubstitution = getSubstitution$1;
    var regExpExec$1 = regexpExecAbstract;
    var wellKnownSymbol$4 = wellKnownSymbol$q;

    var REPLACE = wellKnownSymbol$4('replace');
    var max = Math.max;
    var min$1 = Math.min;
    var concat$1 = uncurryThis$9([].concat);
    var push$3 = uncurryThis$9([].push);
    var stringIndexOf$1 = uncurryThis$9(''.indexOf);
    var stringSlice$2 = uncurryThis$9(''.slice);

    var maybeToString = function (it) {
      return it === undefined ? it : String(it);
    };

    // IE <= 11 replaces $0 with the whole match, as if it was $&
    // https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
    var REPLACE_KEEPS_$0 = (function () {
      // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
      return 'a'.replace(/./, '$0') === '$0';
    })();

    // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
    var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
      if (/./[REPLACE]) {
        return /./[REPLACE]('a', '$0') === '';
      }
      return false;
    })();

    var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$9(function () {
      var re = /./;
      re.exec = function () {
        var result = [];
        result.groups = { a: '7' };
        return result;
      };
      // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
      return ''.replace(re, '$<a>') !== '7';
    });

    // @@replace logic
    fixRegExpWellKnownSymbolLogic$2('replace', function (_, nativeReplace, maybeCallNative) {
      var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

      return [
        // `String.prototype.replace` method
        // https://tc39.es/ecma262/#sec-string.prototype.replace
        function replace(searchValue, replaceValue) {
          var O = requireObjectCoercible$3(this);
          var replacer = isNullOrUndefined$3(searchValue) ? undefined : getMethod$2(searchValue, REPLACE);
          return replacer
            ? call$n(replacer, searchValue, O, replaceValue)
            : call$n(nativeReplace, toString$6(O), searchValue, replaceValue);
        },
        // `RegExp.prototype[@@replace]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
        function (string, replaceValue) {
          var rx = anObject$x(this);
          var S = toString$6(string);

          if (
            typeof replaceValue == 'string' &&
            stringIndexOf$1(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
            stringIndexOf$1(replaceValue, '$<') === -1
          ) {
            var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
            if (res.done) return res.value;
          }

          var functionalReplace = isCallable$5(replaceValue);
          if (!functionalReplace) replaceValue = toString$6(replaceValue);

          var global = rx.global;
          if (global) {
            var fullUnicode = rx.unicode;
            rx.lastIndex = 0;
          }
          var results = [];
          while (true) {
            var result = regExpExec$1(rx, S);
            if (result === null) break;

            push$3(results, result);
            if (!global) break;

            var matchStr = toString$6(result[0]);
            if (matchStr === '') rx.lastIndex = advanceStringIndex$2(S, toLength$2(rx.lastIndex), fullUnicode);
          }

          var accumulatedResult = '';
          var nextSourcePosition = 0;
          for (var i = 0; i < results.length; i++) {
            result = results[i];

            var matched = toString$6(result[0]);
            var position = max(min$1(toIntegerOrInfinity(result.index), S.length), 0);
            var captures = [];
            // NOTE: This is equivalent to
            //   captures = result.slice(1).map(maybeToString)
            // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
            // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
            // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
            for (var j = 1; j < result.length; j++) push$3(captures, maybeToString(result[j]));
            var namedCaptures = result.groups;
            if (functionalReplace) {
              var replacerArgs = concat$1([matched], captures, position, S);
              if (namedCaptures !== undefined) push$3(replacerArgs, namedCaptures);
              var replacement = toString$6(apply$3(replaceValue, undefined, replacerArgs));
            } else {
              replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
            }
            if (position >= nextSourcePosition) {
              accumulatedResult += stringSlice$2(S, nextSourcePosition, position) + replacement;
              nextSourcePosition = position + matched.length;
            }
          }
          return accumulatedResult + stringSlice$2(S, nextSourcePosition);
        }
      ];
    }, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

    var call$m = functionCall;
    var aCallable$m = aCallable$s;
    var anObject$w = anObject$L;

    // https://github.com/tc39/collection-methods
    var collectionAddAll = function addAll(/* ...elements */) {
      var set = anObject$w(this);
      var adder = aCallable$m(set.add);
      for (var k = 0, len = arguments.length; k < len; k++) {
        call$m(adder, set, arguments[k]);
      }
      return set;
    };

    var $$K = _export;
    var addAll = collectionAddAll;

    // `Set.prototype.addAll` method
    // https://github.com/tc39/proposal-collection-methods
    $$K({ target: 'Set', proto: true, real: true, forced: true }, {
      addAll: addAll
    });

    var call$l = functionCall;
    var aCallable$l = aCallable$s;
    var anObject$v = anObject$L;

    // https://github.com/tc39/collection-methods
    var collectionDeleteAll = function deleteAll(/* ...elements */) {
      var collection = anObject$v(this);
      var remover = aCallable$l(collection['delete']);
      var allDeleted = true;
      var wasDeleted;
      for (var k = 0, len = arguments.length; k < len; k++) {
        wasDeleted = call$l(remover, collection, arguments[k]);
        allDeleted = allDeleted && wasDeleted;
      }
      return !!allDeleted;
    };

    var $$J = _export;
    var deleteAll$1 = collectionDeleteAll;

    // `Set.prototype.deleteAll` method
    // https://github.com/tc39/proposal-collection-methods
    $$J({ target: 'Set', proto: true, real: true, forced: true }, {
      deleteAll: deleteAll$1
    });

    var isConstructor = isConstructor$4;
    var tryToString = tryToString$6;

    var $TypeError$5 = TypeError;

    // `Assert: IsConstructor(argument) is true`
    var aConstructor$2 = function (argument) {
      if (isConstructor(argument)) return argument;
      throw $TypeError$5(tryToString(argument) + ' is not a constructor');
    };

    var anObject$u = anObject$L;
    var aConstructor$1 = aConstructor$2;
    var isNullOrUndefined$2 = isNullOrUndefined$9;
    var wellKnownSymbol$3 = wellKnownSymbol$q;

    var SPECIES$1 = wellKnownSymbol$3('species');

    // `SpeciesConstructor` abstract operation
    // https://tc39.es/ecma262/#sec-speciesconstructor
    var speciesConstructor$b = function (O, defaultConstructor) {
      var C = anObject$u(O).constructor;
      var S;
      return C === undefined || isNullOrUndefined$2(S = anObject$u(C)[SPECIES$1]) ? defaultConstructor : aConstructor$1(S);
    };

    var $$I = _export;
    var getBuiltIn$c = getBuiltIn$m;
    var call$k = functionCall;
    var aCallable$k = aCallable$s;
    var anObject$t = anObject$L;
    var speciesConstructor$a = speciesConstructor$b;
    var iterate$q = iterate$t;

    // `Set.prototype.difference` method
    // https://github.com/tc39/proposal-set-methods
    $$I({ target: 'Set', proto: true, real: true, forced: true }, {
      difference: function difference(iterable) {
        var set = anObject$t(this);
        var newSet = new (speciesConstructor$a(set, getBuiltIn$c('Set')))(set);
        var remover = aCallable$k(newSet['delete']);
        iterate$q(iterable, function (value) {
          call$k(remover, newSet, value);
        });
        return newSet;
      }
    });

    var call$j = functionCall;

    var getSetIterator$7 = function (it) {
      // eslint-disable-next-line es/no-set -- safe
      return call$j(Set.prototype.values, it);
    };

    var $$H = _export;
    var anObject$s = anObject$L;
    var bind$f = functionBindContext;
    var getSetIterator$6 = getSetIterator$7;
    var iterate$p = iterate$t;

    // `Set.prototype.every` method
    // https://github.com/tc39/proposal-collection-methods
    $$H({ target: 'Set', proto: true, real: true, forced: true }, {
      every: function every(callbackfn /* , thisArg */) {
        var set = anObject$s(this);
        var iterator = getSetIterator$6(set);
        var boundFunction = bind$f(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        return !iterate$p(iterator, function (value, stop) {
          if (!boundFunction(value, value, set)) return stop();
        }, { IS_ITERATOR: true, INTERRUPTED: true }).stopped;
      }
    });

    var $$G = _export;
    var getBuiltIn$b = getBuiltIn$m;
    var call$i = functionCall;
    var aCallable$j = aCallable$s;
    var anObject$r = anObject$L;
    var bind$e = functionBindContext;
    var speciesConstructor$9 = speciesConstructor$b;
    var getSetIterator$5 = getSetIterator$7;
    var iterate$o = iterate$t;

    // `Set.prototype.filter` method
    // https://github.com/tc39/proposal-collection-methods
    $$G({ target: 'Set', proto: true, real: true, forced: true }, {
      filter: function filter(callbackfn /* , thisArg */) {
        var set = anObject$r(this);
        var iterator = getSetIterator$5(set);
        var boundFunction = bind$e(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        var newSet = new (speciesConstructor$9(set, getBuiltIn$b('Set')))();
        var adder = aCallable$j(newSet.add);
        iterate$o(iterator, function (value) {
          if (boundFunction(value, value, set)) call$i(adder, newSet, value);
        }, { IS_ITERATOR: true });
        return newSet;
      }
    });

    var $$F = _export;
    var anObject$q = anObject$L;
    var bind$d = functionBindContext;
    var getSetIterator$4 = getSetIterator$7;
    var iterate$n = iterate$t;

    // `Set.prototype.find` method
    // https://github.com/tc39/proposal-collection-methods
    $$F({ target: 'Set', proto: true, real: true, forced: true }, {
      find: function find(callbackfn /* , thisArg */) {
        var set = anObject$q(this);
        var iterator = getSetIterator$4(set);
        var boundFunction = bind$d(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        return iterate$n(iterator, function (value, stop) {
          if (boundFunction(value, value, set)) return stop(value);
        }, { IS_ITERATOR: true, INTERRUPTED: true }).result;
      }
    });

    var $$E = _export;
    var getBuiltIn$a = getBuiltIn$m;
    var call$h = functionCall;
    var aCallable$i = aCallable$s;
    var anObject$p = anObject$L;
    var speciesConstructor$8 = speciesConstructor$b;
    var iterate$m = iterate$t;

    // `Set.prototype.intersection` method
    // https://github.com/tc39/proposal-set-methods
    $$E({ target: 'Set', proto: true, real: true, forced: true }, {
      intersection: function intersection(iterable) {
        var set = anObject$p(this);
        var newSet = new (speciesConstructor$8(set, getBuiltIn$a('Set')))();
        var hasCheck = aCallable$i(set.has);
        var adder = aCallable$i(newSet.add);
        iterate$m(iterable, function (value) {
          if (call$h(hasCheck, set, value)) call$h(adder, newSet, value);
        });
        return newSet;
      }
    });

    var $$D = _export;
    var call$g = functionCall;
    var aCallable$h = aCallable$s;
    var anObject$o = anObject$L;
    var iterate$l = iterate$t;

    // `Set.prototype.isDisjointFrom` method
    // https://tc39.github.io/proposal-set-methods/#Set.prototype.isDisjointFrom
    $$D({ target: 'Set', proto: true, real: true, forced: true }, {
      isDisjointFrom: function isDisjointFrom(iterable) {
        var set = anObject$o(this);
        var hasCheck = aCallable$h(set.has);
        return !iterate$l(iterable, function (value, stop) {
          if (call$g(hasCheck, set, value) === true) return stop();
        }, { INTERRUPTED: true }).stopped;
      }
    });

    var $$C = _export;
    var getBuiltIn$9 = getBuiltIn$m;
    var call$f = functionCall;
    var aCallable$g = aCallable$s;
    var isCallable$4 = isCallable$r;
    var anObject$n = anObject$L;
    var getIterator = getIterator$3;
    var iterate$k = iterate$t;

    // `Set.prototype.isSubsetOf` method
    // https://tc39.github.io/proposal-set-methods/#Set.prototype.isSubsetOf
    $$C({ target: 'Set', proto: true, real: true, forced: true }, {
      isSubsetOf: function isSubsetOf(iterable) {
        var iterator = getIterator(this);
        var otherSet = anObject$n(iterable);
        var hasCheck = otherSet.has;
        if (!isCallable$4(hasCheck)) {
          otherSet = new (getBuiltIn$9('Set'))(iterable);
          hasCheck = aCallable$g(otherSet.has);
        }
        return !iterate$k(iterator, function (value, stop) {
          if (call$f(hasCheck, otherSet, value) === false) return stop();
        }, { IS_ITERATOR: true, INTERRUPTED: true }).stopped;
      }
    });

    var $$B = _export;
    var call$e = functionCall;
    var aCallable$f = aCallable$s;
    var anObject$m = anObject$L;
    var iterate$j = iterate$t;

    // `Set.prototype.isSupersetOf` method
    // https://tc39.github.io/proposal-set-methods/#Set.prototype.isSupersetOf
    $$B({ target: 'Set', proto: true, real: true, forced: true }, {
      isSupersetOf: function isSupersetOf(iterable) {
        var set = anObject$m(this);
        var hasCheck = aCallable$f(set.has);
        return !iterate$j(iterable, function (value, stop) {
          if (call$e(hasCheck, set, value) === false) return stop();
        }, { INTERRUPTED: true }).stopped;
      }
    });

    var $$A = _export;
    var uncurryThis$8 = functionUncurryThis;
    var anObject$l = anObject$L;
    var toString$5 = toString$f;
    var getSetIterator$3 = getSetIterator$7;
    var iterate$i = iterate$t;

    var arrayJoin = uncurryThis$8([].join);
    var push$2 = [].push;

    // `Set.prototype.join` method
    // https://github.com/tc39/proposal-collection-methods
    $$A({ target: 'Set', proto: true, real: true, forced: true }, {
      join: function join(separator) {
        var set = anObject$l(this);
        var iterator = getSetIterator$3(set);
        var sep = separator === undefined ? ',' : toString$5(separator);
        var result = [];
        iterate$i(iterator, push$2, { that: result, IS_ITERATOR: true });
        return arrayJoin(result, sep);
      }
    });

    var $$z = _export;
    var getBuiltIn$8 = getBuiltIn$m;
    var bind$c = functionBindContext;
    var call$d = functionCall;
    var aCallable$e = aCallable$s;
    var anObject$k = anObject$L;
    var speciesConstructor$7 = speciesConstructor$b;
    var getSetIterator$2 = getSetIterator$7;
    var iterate$h = iterate$t;

    // `Set.prototype.map` method
    // https://github.com/tc39/proposal-collection-methods
    $$z({ target: 'Set', proto: true, real: true, forced: true }, {
      map: function map(callbackfn /* , thisArg */) {
        var set = anObject$k(this);
        var iterator = getSetIterator$2(set);
        var boundFunction = bind$c(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        var newSet = new (speciesConstructor$7(set, getBuiltIn$8('Set')))();
        var adder = aCallable$e(newSet.add);
        iterate$h(iterator, function (value) {
          call$d(adder, newSet, boundFunction(value, value, set));
        }, { IS_ITERATOR: true });
        return newSet;
      }
    });

    var $$y = _export;
    var aCallable$d = aCallable$s;
    var anObject$j = anObject$L;
    var getSetIterator$1 = getSetIterator$7;
    var iterate$g = iterate$t;

    var $TypeError$4 = TypeError;

    // `Set.prototype.reduce` method
    // https://github.com/tc39/proposal-collection-methods
    $$y({ target: 'Set', proto: true, real: true, forced: true }, {
      reduce: function reduce(callbackfn /* , initialValue */) {
        var set = anObject$j(this);
        var iterator = getSetIterator$1(set);
        var noInitial = arguments.length < 2;
        var accumulator = noInitial ? undefined : arguments[1];
        aCallable$d(callbackfn);
        iterate$g(iterator, function (value) {
          if (noInitial) {
            noInitial = false;
            accumulator = value;
          } else {
            accumulator = callbackfn(accumulator, value, value, set);
          }
        }, { IS_ITERATOR: true });
        if (noInitial) throw $TypeError$4('Reduce of empty set with no initial value');
        return accumulator;
      }
    });

    var $$x = _export;
    var anObject$i = anObject$L;
    var bind$b = functionBindContext;
    var getSetIterator = getSetIterator$7;
    var iterate$f = iterate$t;

    // `Set.prototype.some` method
    // https://github.com/tc39/proposal-collection-methods
    $$x({ target: 'Set', proto: true, real: true, forced: true }, {
      some: function some(callbackfn /* , thisArg */) {
        var set = anObject$i(this);
        var iterator = getSetIterator(set);
        var boundFunction = bind$b(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        return iterate$f(iterator, function (value, stop) {
          if (boundFunction(value, value, set)) return stop();
        }, { IS_ITERATOR: true, INTERRUPTED: true }).stopped;
      }
    });

    var $$w = _export;
    var getBuiltIn$7 = getBuiltIn$m;
    var call$c = functionCall;
    var aCallable$c = aCallable$s;
    var anObject$h = anObject$L;
    var speciesConstructor$6 = speciesConstructor$b;
    var iterate$e = iterate$t;

    // `Set.prototype.symmetricDifference` method
    // https://github.com/tc39/proposal-set-methods
    $$w({ target: 'Set', proto: true, real: true, forced: true }, {
      symmetricDifference: function symmetricDifference(iterable) {
        var set = anObject$h(this);
        var newSet = new (speciesConstructor$6(set, getBuiltIn$7('Set')))(set);
        var remover = aCallable$c(newSet['delete']);
        var adder = aCallable$c(newSet.add);
        iterate$e(iterable, function (value) {
          call$c(remover, newSet, value) || call$c(adder, newSet, value);
        });
        return newSet;
      }
    });

    var $$v = _export;
    var getBuiltIn$6 = getBuiltIn$m;
    var aCallable$b = aCallable$s;
    var anObject$g = anObject$L;
    var speciesConstructor$5 = speciesConstructor$b;
    var iterate$d = iterate$t;

    // `Set.prototype.union` method
    // https://github.com/tc39/proposal-set-methods
    $$v({ target: 'Set', proto: true, real: true, forced: true }, {
      union: function union(iterable) {
        var set = anObject$g(this);
        var newSet = new (speciesConstructor$5(set, getBuiltIn$6('Set')))(set);
        iterate$d(iterable, aCallable$b(newSet.add), { that: newSet });
        return newSet;
      }
    });

    // iterable DOM collections
    // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
    var domIterables = {
      CSSRuleList: 0,
      CSSStyleDeclaration: 0,
      CSSValueList: 0,
      ClientRectList: 0,
      DOMRectList: 0,
      DOMStringList: 0,
      DOMTokenList: 1,
      DataTransferItemList: 0,
      FileList: 0,
      HTMLAllCollection: 0,
      HTMLCollection: 0,
      HTMLFormElement: 0,
      HTMLSelectElement: 0,
      MediaList: 0,
      MimeTypeArray: 0,
      NamedNodeMap: 0,
      NodeList: 1,
      PaintRequestList: 0,
      Plugin: 0,
      PluginArray: 0,
      SVGLengthList: 0,
      SVGNumberList: 0,
      SVGPathSegList: 0,
      SVGPointList: 0,
      SVGStringList: 0,
      SVGTransformList: 0,
      SourceBufferList: 0,
      StyleSheetList: 0,
      TextTrackCueList: 0,
      TextTrackList: 0,
      TouchList: 0
    };

    // in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
    var documentCreateElement = documentCreateElement$2;

    var classList = documentCreateElement('span').classList;
    var DOMTokenListPrototype$2 = classList && classList.constructor && classList.constructor.prototype;

    var domTokenListPrototype = DOMTokenListPrototype$2 === Object.prototype ? undefined : DOMTokenListPrototype$2;

    var global$c = global$u;
    var DOMIterables$1 = domIterables;
    var DOMTokenListPrototype$1 = domTokenListPrototype;
    var forEach = arrayForEach;
    var createNonEnumerableProperty$2 = createNonEnumerableProperty$7;

    var handlePrototype$1 = function (CollectionPrototype) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
        createNonEnumerableProperty$2(CollectionPrototype, 'forEach', forEach);
      } catch (error) {
        CollectionPrototype.forEach = forEach;
      }
    };

    for (var COLLECTION_NAME$1 in DOMIterables$1) {
      if (DOMIterables$1[COLLECTION_NAME$1]) {
        handlePrototype$1(global$c[COLLECTION_NAME$1] && global$c[COLLECTION_NAME$1].prototype);
      }
    }

    handlePrototype$1(DOMTokenListPrototype$1);

    var global$b = global$u;
    var DOMIterables = domIterables;
    var DOMTokenListPrototype = domTokenListPrototype;
    var ArrayIteratorMethods = es_array_iterator;
    var createNonEnumerableProperty$1 = createNonEnumerableProperty$7;
    var wellKnownSymbol$2 = wellKnownSymbol$q;

    var ITERATOR$1 = wellKnownSymbol$2('iterator');
    var TO_STRING_TAG = wellKnownSymbol$2('toStringTag');
    var ArrayValues = ArrayIteratorMethods.values;

    var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
      if (CollectionPrototype) {
        // some Chrome versions have non-configurable methods on DOMTokenList
        if (CollectionPrototype[ITERATOR$1] !== ArrayValues) try {
          createNonEnumerableProperty$1(CollectionPrototype, ITERATOR$1, ArrayValues);
        } catch (error) {
          CollectionPrototype[ITERATOR$1] = ArrayValues;
        }
        if (!CollectionPrototype[TO_STRING_TAG]) {
          createNonEnumerableProperty$1(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
        }
        if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
          // some Chrome versions have non-configurable methods on DOMTokenList
          if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
            createNonEnumerableProperty$1(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
          } catch (error) {
            CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
          }
        }
      }
    };

    for (var COLLECTION_NAME in DOMIterables) {
      handlePrototype(global$b[COLLECTION_NAME] && global$b[COLLECTION_NAME].prototype, COLLECTION_NAME);
    }

    handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

    var $$u = _export;
    var call$b = functionCall;

    // `URL.prototype.toJSON` method
    // https://url.spec.whatwg.org/#dom-url-tojson
    $$u({ target: 'URL', proto: true, enumerable: true }, {
      toJSON: function toJSON() {
        return call$b(URL.prototype.toString, this);
      }
    });

    var runtime = {exports: {}};

    /**
     * Copyright (c) 2014-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    (function (module) {
    	var runtime = (function (exports) {

    	  var Op = Object.prototype;
    	  var hasOwn = Op.hasOwnProperty;
    	  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
    	  var undefined$1; // More compressible than void 0.
    	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
    	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
    	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    	  function define(obj, key, value) {
    	    Object.defineProperty(obj, key, {
    	      value: value,
    	      enumerable: true,
    	      configurable: true,
    	      writable: true
    	    });
    	    return obj[key];
    	  }
    	  try {
    	    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    	    define({}, "");
    	  } catch (err) {
    	    define = function(obj, key, value) {
    	      return obj[key] = value;
    	    };
    	  }

    	  function wrap(innerFn, outerFn, self, tryLocsList) {
    	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    	    var generator = Object.create(protoGenerator.prototype);
    	    var context = new Context(tryLocsList || []);

    	    // The ._invoke method unifies the implementations of the .next,
    	    // .throw, and .return methods.
    	    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

    	    return generator;
    	  }
    	  exports.wrap = wrap;

    	  // Try/catch helper to minimize deoptimizations. Returns a completion
    	  // record like context.tryEntries[i].completion. This interface could
    	  // have been (and was previously) designed to take a closure to be
    	  // invoked without arguments, but in all the cases we care about we
    	  // already have an existing method we want to call, so there's no need
    	  // to create a new function object. We can even get away with assuming
    	  // the method takes exactly one argument, since that happens to be true
    	  // in every case, so we don't have to touch the arguments object. The
    	  // only additional allocation required is the completion record, which
    	  // has a stable shape and so hopefully should be cheap to allocate.
    	  function tryCatch(fn, obj, arg) {
    	    try {
    	      return { type: "normal", arg: fn.call(obj, arg) };
    	    } catch (err) {
    	      return { type: "throw", arg: err };
    	    }
    	  }

    	  var GenStateSuspendedStart = "suspendedStart";
    	  var GenStateSuspendedYield = "suspendedYield";
    	  var GenStateExecuting = "executing";
    	  var GenStateCompleted = "completed";

    	  // Returning this object from the innerFn has the same effect as
    	  // breaking out of the dispatch switch statement.
    	  var ContinueSentinel = {};

    	  // Dummy constructor functions that we use as the .constructor and
    	  // .constructor.prototype properties for functions that return Generator
    	  // objects. For full spec compliance, you may wish to configure your
    	  // minifier not to mangle the names of these two functions.
    	  function Generator() {}
    	  function GeneratorFunction() {}
    	  function GeneratorFunctionPrototype() {}

    	  // This is a polyfill for %IteratorPrototype% for environments that
    	  // don't natively support it.
    	  var IteratorPrototype = {};
    	  define(IteratorPrototype, iteratorSymbol, function () {
    	    return this;
    	  });

    	  var getProto = Object.getPrototypeOf;
    	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    	  if (NativeIteratorPrototype &&
    	      NativeIteratorPrototype !== Op &&
    	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    	    // This environment has a native %IteratorPrototype%; use it instead
    	    // of the polyfill.
    	    IteratorPrototype = NativeIteratorPrototype;
    	  }

    	  var Gp = GeneratorFunctionPrototype.prototype =
    	    Generator.prototype = Object.create(IteratorPrototype);
    	  GeneratorFunction.prototype = GeneratorFunctionPrototype;
    	  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
    	  defineProperty(
    	    GeneratorFunctionPrototype,
    	    "constructor",
    	    { value: GeneratorFunction, configurable: true }
    	  );
    	  GeneratorFunction.displayName = define(
    	    GeneratorFunctionPrototype,
    	    toStringTagSymbol,
    	    "GeneratorFunction"
    	  );

    	  // Helper for defining the .next, .throw, and .return methods of the
    	  // Iterator interface in terms of a single ._invoke method.
    	  function defineIteratorMethods(prototype) {
    	    ["next", "throw", "return"].forEach(function(method) {
    	      define(prototype, method, function(arg) {
    	        return this._invoke(method, arg);
    	      });
    	    });
    	  }

    	  exports.isGeneratorFunction = function(genFun) {
    	    var ctor = typeof genFun === "function" && genFun.constructor;
    	    return ctor
    	      ? ctor === GeneratorFunction ||
    	        // For the native GeneratorFunction constructor, the best we can
    	        // do is to check its .name property.
    	        (ctor.displayName || ctor.name) === "GeneratorFunction"
    	      : false;
    	  };

    	  exports.mark = function(genFun) {
    	    if (Object.setPrototypeOf) {
    	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    	    } else {
    	      genFun.__proto__ = GeneratorFunctionPrototype;
    	      define(genFun, toStringTagSymbol, "GeneratorFunction");
    	    }
    	    genFun.prototype = Object.create(Gp);
    	    return genFun;
    	  };

    	  // Within the body of any async function, `await x` is transformed to
    	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
    	  // meant to be awaited.
    	  exports.awrap = function(arg) {
    	    return { __await: arg };
    	  };

    	  function AsyncIterator(generator, PromiseImpl) {
    	    function invoke(method, arg, resolve, reject) {
    	      var record = tryCatch(generator[method], generator, arg);
    	      if (record.type === "throw") {
    	        reject(record.arg);
    	      } else {
    	        var result = record.arg;
    	        var value = result.value;
    	        if (value &&
    	            typeof value === "object" &&
    	            hasOwn.call(value, "__await")) {
    	          return PromiseImpl.resolve(value.__await).then(function(value) {
    	            invoke("next", value, resolve, reject);
    	          }, function(err) {
    	            invoke("throw", err, resolve, reject);
    	          });
    	        }

    	        return PromiseImpl.resolve(value).then(function(unwrapped) {
    	          // When a yielded Promise is resolved, its final value becomes
    	          // the .value of the Promise<{value,done}> result for the
    	          // current iteration.
    	          result.value = unwrapped;
    	          resolve(result);
    	        }, function(error) {
    	          // If a rejected Promise was yielded, throw the rejection back
    	          // into the async generator function so it can be handled there.
    	          return invoke("throw", error, resolve, reject);
    	        });
    	      }
    	    }

    	    var previousPromise;

    	    function enqueue(method, arg) {
    	      function callInvokeWithMethodAndArg() {
    	        return new PromiseImpl(function(resolve, reject) {
    	          invoke(method, arg, resolve, reject);
    	        });
    	      }

    	      return previousPromise =
    	        // If enqueue has been called before, then we want to wait until
    	        // all previous Promises have been resolved before calling invoke,
    	        // so that results are always delivered in the correct order. If
    	        // enqueue has not been called before, then it is important to
    	        // call invoke immediately, without waiting on a callback to fire,
    	        // so that the async generator function has the opportunity to do
    	        // any necessary setup in a predictable way. This predictability
    	        // is why the Promise constructor synchronously invokes its
    	        // executor callback, and why async functions synchronously
    	        // execute code before the first await. Since we implement simple
    	        // async functions in terms of async generators, it is especially
    	        // important to get this right, even though it requires care.
    	        previousPromise ? previousPromise.then(
    	          callInvokeWithMethodAndArg,
    	          // Avoid propagating failures to Promises returned by later
    	          // invocations of the iterator.
    	          callInvokeWithMethodAndArg
    	        ) : callInvokeWithMethodAndArg();
    	    }

    	    // Define the unified helper method that is used to implement .next,
    	    // .throw, and .return (see defineIteratorMethods).
    	    defineProperty(this, "_invoke", { value: enqueue });
    	  }

    	  defineIteratorMethods(AsyncIterator.prototype);
    	  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    	    return this;
    	  });
    	  exports.AsyncIterator = AsyncIterator;

    	  // Note that simple async functions are implemented on top of
    	  // AsyncIterator objects; they just return a Promise for the value of
    	  // the final result produced by the iterator.
    	  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    	    if (PromiseImpl === void 0) PromiseImpl = Promise;

    	    var iter = new AsyncIterator(
    	      wrap(innerFn, outerFn, self, tryLocsList),
    	      PromiseImpl
    	    );

    	    return exports.isGeneratorFunction(outerFn)
    	      ? iter // If outerFn is a generator, return the full iterator.
    	      : iter.next().then(function(result) {
    	          return result.done ? result.value : iter.next();
    	        });
    	  };

    	  function makeInvokeMethod(innerFn, self, context) {
    	    var state = GenStateSuspendedStart;

    	    return function invoke(method, arg) {
    	      if (state === GenStateExecuting) {
    	        throw new Error("Generator is already running");
    	      }

    	      if (state === GenStateCompleted) {
    	        if (method === "throw") {
    	          throw arg;
    	        }

    	        // Be forgiving, per 25.3.3.3.3 of the spec:
    	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
    	        return doneResult();
    	      }

    	      context.method = method;
    	      context.arg = arg;

    	      while (true) {
    	        var delegate = context.delegate;
    	        if (delegate) {
    	          var delegateResult = maybeInvokeDelegate(delegate, context);
    	          if (delegateResult) {
    	            if (delegateResult === ContinueSentinel) continue;
    	            return delegateResult;
    	          }
    	        }

    	        if (context.method === "next") {
    	          // Setting context._sent for legacy support of Babel's
    	          // function.sent implementation.
    	          context.sent = context._sent = context.arg;

    	        } else if (context.method === "throw") {
    	          if (state === GenStateSuspendedStart) {
    	            state = GenStateCompleted;
    	            throw context.arg;
    	          }

    	          context.dispatchException(context.arg);

    	        } else if (context.method === "return") {
    	          context.abrupt("return", context.arg);
    	        }

    	        state = GenStateExecuting;

    	        var record = tryCatch(innerFn, self, context);
    	        if (record.type === "normal") {
    	          // If an exception is thrown from innerFn, we leave state ===
    	          // GenStateExecuting and loop back for another invocation.
    	          state = context.done
    	            ? GenStateCompleted
    	            : GenStateSuspendedYield;

    	          if (record.arg === ContinueSentinel) {
    	            continue;
    	          }

    	          return {
    	            value: record.arg,
    	            done: context.done
    	          };

    	        } else if (record.type === "throw") {
    	          state = GenStateCompleted;
    	          // Dispatch the exception by looping back around to the
    	          // context.dispatchException(context.arg) call above.
    	          context.method = "throw";
    	          context.arg = record.arg;
    	        }
    	      }
    	    };
    	  }

    	  // Call delegate.iterator[context.method](context.arg) and handle the
    	  // result, either by returning a { value, done } result from the
    	  // delegate iterator, or by modifying context.method and context.arg,
    	  // setting context.delegate to null, and returning the ContinueSentinel.
    	  function maybeInvokeDelegate(delegate, context) {
    	    var methodName = context.method;
    	    var method = delegate.iterator[methodName];
    	    if (method === undefined$1) {
    	      // A .throw or .return when the delegate iterator has no .throw
    	      // method, or a missing .next mehtod, always terminate the
    	      // yield* loop.
    	      context.delegate = null;

    	      // Note: ["return"] must be used for ES3 parsing compatibility.
    	      if (methodName === "throw" && delegate.iterator["return"]) {
    	        // If the delegate iterator has a return method, give it a
    	        // chance to clean up.
    	        context.method = "return";
    	        context.arg = undefined$1;
    	        maybeInvokeDelegate(delegate, context);

    	        if (context.method === "throw") {
    	          // If maybeInvokeDelegate(context) changed context.method from
    	          // "return" to "throw", let that override the TypeError below.
    	          return ContinueSentinel;
    	        }
    	      }
    	      if (methodName !== "return") {
    	        context.method = "throw";
    	        context.arg = new TypeError(
    	          "The iterator does not provide a '" + methodName + "' method");
    	      }

    	      return ContinueSentinel;
    	    }

    	    var record = tryCatch(method, delegate.iterator, context.arg);

    	    if (record.type === "throw") {
    	      context.method = "throw";
    	      context.arg = record.arg;
    	      context.delegate = null;
    	      return ContinueSentinel;
    	    }

    	    var info = record.arg;

    	    if (! info) {
    	      context.method = "throw";
    	      context.arg = new TypeError("iterator result is not an object");
    	      context.delegate = null;
    	      return ContinueSentinel;
    	    }

    	    if (info.done) {
    	      // Assign the result of the finished delegate to the temporary
    	      // variable specified by delegate.resultName (see delegateYield).
    	      context[delegate.resultName] = info.value;

    	      // Resume execution at the desired location (see delegateYield).
    	      context.next = delegate.nextLoc;

    	      // If context.method was "throw" but the delegate handled the
    	      // exception, let the outer generator proceed normally. If
    	      // context.method was "next", forget context.arg since it has been
    	      // "consumed" by the delegate iterator. If context.method was
    	      // "return", allow the original .return call to continue in the
    	      // outer generator.
    	      if (context.method !== "return") {
    	        context.method = "next";
    	        context.arg = undefined$1;
    	      }

    	    } else {
    	      // Re-yield the result returned by the delegate method.
    	      return info;
    	    }

    	    // The delegate iterator is finished, so forget it and continue with
    	    // the outer generator.
    	    context.delegate = null;
    	    return ContinueSentinel;
    	  }

    	  // Define Generator.prototype.{next,throw,return} in terms of the
    	  // unified ._invoke helper method.
    	  defineIteratorMethods(Gp);

    	  define(Gp, toStringTagSymbol, "Generator");

    	  // A Generator should always return itself as the iterator object when the
    	  // @@iterator function is called on it. Some browsers' implementations of the
    	  // iterator prototype chain incorrectly implement this, causing the Generator
    	  // object to not be returned from this call. This ensures that doesn't happen.
    	  // See https://github.com/facebook/regenerator/issues/274 for more details.
    	  define(Gp, iteratorSymbol, function() {
    	    return this;
    	  });

    	  define(Gp, "toString", function() {
    	    return "[object Generator]";
    	  });

    	  function pushTryEntry(locs) {
    	    var entry = { tryLoc: locs[0] };

    	    if (1 in locs) {
    	      entry.catchLoc = locs[1];
    	    }

    	    if (2 in locs) {
    	      entry.finallyLoc = locs[2];
    	      entry.afterLoc = locs[3];
    	    }

    	    this.tryEntries.push(entry);
    	  }

    	  function resetTryEntry(entry) {
    	    var record = entry.completion || {};
    	    record.type = "normal";
    	    delete record.arg;
    	    entry.completion = record;
    	  }

    	  function Context(tryLocsList) {
    	    // The root entry object (effectively a try statement without a catch
    	    // or a finally block) gives us a place to store values thrown from
    	    // locations where there is no enclosing try statement.
    	    this.tryEntries = [{ tryLoc: "root" }];
    	    tryLocsList.forEach(pushTryEntry, this);
    	    this.reset(true);
    	  }

    	  exports.keys = function(val) {
    	    var object = Object(val);
    	    var keys = [];
    	    for (var key in object) {
    	      keys.push(key);
    	    }
    	    keys.reverse();

    	    // Rather than returning an object with a next method, we keep
    	    // things simple and return the next function itself.
    	    return function next() {
    	      while (keys.length) {
    	        var key = keys.pop();
    	        if (key in object) {
    	          next.value = key;
    	          next.done = false;
    	          return next;
    	        }
    	      }

    	      // To avoid creating an additional object, we just hang the .value
    	      // and .done properties off the next function object itself. This
    	      // also ensures that the minifier will not anonymize the function.
    	      next.done = true;
    	      return next;
    	    };
    	  };

    	  function values(iterable) {
    	    if (iterable) {
    	      var iteratorMethod = iterable[iteratorSymbol];
    	      if (iteratorMethod) {
    	        return iteratorMethod.call(iterable);
    	      }

    	      if (typeof iterable.next === "function") {
    	        return iterable;
    	      }

    	      if (!isNaN(iterable.length)) {
    	        var i = -1, next = function next() {
    	          while (++i < iterable.length) {
    	            if (hasOwn.call(iterable, i)) {
    	              next.value = iterable[i];
    	              next.done = false;
    	              return next;
    	            }
    	          }

    	          next.value = undefined$1;
    	          next.done = true;

    	          return next;
    	        };

    	        return next.next = next;
    	      }
    	    }

    	    // Return an iterator with no values.
    	    return { next: doneResult };
    	  }
    	  exports.values = values;

    	  function doneResult() {
    	    return { value: undefined$1, done: true };
    	  }

    	  Context.prototype = {
    	    constructor: Context,

    	    reset: function(skipTempReset) {
    	      this.prev = 0;
    	      this.next = 0;
    	      // Resetting context._sent for legacy support of Babel's
    	      // function.sent implementation.
    	      this.sent = this._sent = undefined$1;
    	      this.done = false;
    	      this.delegate = null;

    	      this.method = "next";
    	      this.arg = undefined$1;

    	      this.tryEntries.forEach(resetTryEntry);

    	      if (!skipTempReset) {
    	        for (var name in this) {
    	          // Not sure about the optimal order of these conditions:
    	          if (name.charAt(0) === "t" &&
    	              hasOwn.call(this, name) &&
    	              !isNaN(+name.slice(1))) {
    	            this[name] = undefined$1;
    	          }
    	        }
    	      }
    	    },

    	    stop: function() {
    	      this.done = true;

    	      var rootEntry = this.tryEntries[0];
    	      var rootRecord = rootEntry.completion;
    	      if (rootRecord.type === "throw") {
    	        throw rootRecord.arg;
    	      }

    	      return this.rval;
    	    },

    	    dispatchException: function(exception) {
    	      if (this.done) {
    	        throw exception;
    	      }

    	      var context = this;
    	      function handle(loc, caught) {
    	        record.type = "throw";
    	        record.arg = exception;
    	        context.next = loc;

    	        if (caught) {
    	          // If the dispatched exception was caught by a catch block,
    	          // then let that catch block handle the exception normally.
    	          context.method = "next";
    	          context.arg = undefined$1;
    	        }

    	        return !! caught;
    	      }

    	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
    	        var entry = this.tryEntries[i];
    	        var record = entry.completion;

    	        if (entry.tryLoc === "root") {
    	          // Exception thrown outside of any try block that could handle
    	          // it, so set the completion value of the entire function to
    	          // throw the exception.
    	          return handle("end");
    	        }

    	        if (entry.tryLoc <= this.prev) {
    	          var hasCatch = hasOwn.call(entry, "catchLoc");
    	          var hasFinally = hasOwn.call(entry, "finallyLoc");

    	          if (hasCatch && hasFinally) {
    	            if (this.prev < entry.catchLoc) {
    	              return handle(entry.catchLoc, true);
    	            } else if (this.prev < entry.finallyLoc) {
    	              return handle(entry.finallyLoc);
    	            }

    	          } else if (hasCatch) {
    	            if (this.prev < entry.catchLoc) {
    	              return handle(entry.catchLoc, true);
    	            }

    	          } else if (hasFinally) {
    	            if (this.prev < entry.finallyLoc) {
    	              return handle(entry.finallyLoc);
    	            }

    	          } else {
    	            throw new Error("try statement without catch or finally");
    	          }
    	        }
    	      }
    	    },

    	    abrupt: function(type, arg) {
    	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
    	        var entry = this.tryEntries[i];
    	        if (entry.tryLoc <= this.prev &&
    	            hasOwn.call(entry, "finallyLoc") &&
    	            this.prev < entry.finallyLoc) {
    	          var finallyEntry = entry;
    	          break;
    	        }
    	      }

    	      if (finallyEntry &&
    	          (type === "break" ||
    	           type === "continue") &&
    	          finallyEntry.tryLoc <= arg &&
    	          arg <= finallyEntry.finallyLoc) {
    	        // Ignore the finally entry if control is not jumping to a
    	        // location outside the try/catch block.
    	        finallyEntry = null;
    	      }

    	      var record = finallyEntry ? finallyEntry.completion : {};
    	      record.type = type;
    	      record.arg = arg;

    	      if (finallyEntry) {
    	        this.method = "next";
    	        this.next = finallyEntry.finallyLoc;
    	        return ContinueSentinel;
    	      }

    	      return this.complete(record);
    	    },

    	    complete: function(record, afterLoc) {
    	      if (record.type === "throw") {
    	        throw record.arg;
    	      }

    	      if (record.type === "break" ||
    	          record.type === "continue") {
    	        this.next = record.arg;
    	      } else if (record.type === "return") {
    	        this.rval = this.arg = record.arg;
    	        this.method = "return";
    	        this.next = "end";
    	      } else if (record.type === "normal" && afterLoc) {
    	        this.next = afterLoc;
    	      }

    	      return ContinueSentinel;
    	    },

    	    finish: function(finallyLoc) {
    	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
    	        var entry = this.tryEntries[i];
    	        if (entry.finallyLoc === finallyLoc) {
    	          this.complete(entry.completion, entry.afterLoc);
    	          resetTryEntry(entry);
    	          return ContinueSentinel;
    	        }
    	      }
    	    },

    	    "catch": function(tryLoc) {
    	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
    	        var entry = this.tryEntries[i];
    	        if (entry.tryLoc === tryLoc) {
    	          var record = entry.completion;
    	          if (record.type === "throw") {
    	            var thrown = record.arg;
    	            resetTryEntry(entry);
    	          }
    	          return thrown;
    	        }
    	      }

    	      // The context.catch method must only be called with a location
    	      // argument that corresponds to a known catch block.
    	      throw new Error("illegal catch attempt");
    	    },

    	    delegateYield: function(iterable, resultName, nextLoc) {
    	      this.delegate = {
    	        iterator: values(iterable),
    	        resultName: resultName,
    	        nextLoc: nextLoc
    	      };

    	      if (this.method === "next") {
    	        // Deliberately forget the last sent value so that we don't
    	        // accidentally pass it on to the delegate.
    	        this.arg = undefined$1;
    	      }

    	      return ContinueSentinel;
    	    }
    	  };

    	  // Regardless of whether this script is executing as a CommonJS module
    	  // or not, return the runtime object so that we can declare the variable
    	  // regeneratorRuntime in the outer scope, which allows this module to be
    	  // injected easily by `bin/regenerator --include-runtime script.js`.
    	  return exports;

    	}(
    	  // If this script is executing as a CommonJS module, use module.exports
    	  // as the regeneratorRuntime namespace. Otherwise create a new empty
    	  // object. Either way, the resulting object will be used to initialize
    	  // the regeneratorRuntime variable at the top of this file.
    	  module.exports 
    	));

    	try {
    	  regeneratorRuntime = runtime;
    	} catch (accidentalStrictMode) {
    	  // This module should not be running in strict mode, so the above
    	  // assignment should always work unless something is misconfigured. Just
    	  // in case runtime.js accidentally runs in strict mode, in modern engines
    	  // we can explicitly access globalThis. In older engines we can escape
    	  // strict mode using a global Function call. This could conceivably fail
    	  // if a Content Security Policy forbids using Function, but in that case
    	  // the proper solution is to fix the accidental strict mode problem. If
    	  // you've misconfigured your bundler to force strict mode and applied a
    	  // CSP to forbid Function, and you're not willing to fix either of those
    	  // problems, please detail your unique predicament in a GitHub issue.
    	  if (typeof globalThis === "object") {
    	    globalThis.regeneratorRuntime = runtime;
    	  } else {
    	    Function("r", "regeneratorRuntime = r")(runtime);
    	  }
    	}
    } (runtime));

    var reusables = {};

    // a string of all valid unicode whitespaces
    var whitespaces$3 = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
      '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

    var uncurryThis$7 = functionUncurryThis;
    var requireObjectCoercible$2 = requireObjectCoercible$8;
    var toString$4 = toString$f;
    var whitespaces$2 = whitespaces$3;

    var replace$1 = uncurryThis$7(''.replace);
    var whitespace = '[' + whitespaces$2 + ']';
    var ltrim = RegExp('^' + whitespace + whitespace + '*');
    var rtrim = RegExp(whitespace + whitespace + '*$');

    // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
    var createMethod = function (TYPE) {
      return function ($this) {
        var string = toString$4(requireObjectCoercible$2($this));
        if (TYPE & 1) string = replace$1(string, ltrim, '');
        if (TYPE & 2) string = replace$1(string, rtrim, '');
        return string;
      };
    };

    var stringTrim = {
      // `String.prototype.{ trimLeft, trimStart }` methods
      // https://tc39.es/ecma262/#sec-string.prototype.trimstart
      start: createMethod(1),
      // `String.prototype.{ trimRight, trimEnd }` methods
      // https://tc39.es/ecma262/#sec-string.prototype.trimend
      end: createMethod(2),
      // `String.prototype.trim` method
      // https://tc39.es/ecma262/#sec-string.prototype.trim
      trim: createMethod(3)
    };

    var global$a = global$u;
    var fails$8 = fails$G;
    var uncurryThis$6 = functionUncurryThis;
    var toString$3 = toString$f;
    var trim$1 = stringTrim.trim;
    var whitespaces$1 = whitespaces$3;

    var charAt$1 = uncurryThis$6(''.charAt);
    var $parseFloat$1 = global$a.parseFloat;
    var Symbol$1 = global$a.Symbol;
    var ITERATOR = Symbol$1 && Symbol$1.iterator;
    var FORCED$1 = 1 / $parseFloat$1(whitespaces$1 + '-0') !== -Infinity
      // MS Edge 18- broken with boxed symbols
      || (ITERATOR && !fails$8(function () { $parseFloat$1(Object(ITERATOR)); }));

    // `parseFloat` method
    // https://tc39.es/ecma262/#sec-parsefloat-string
    var numberParseFloat = FORCED$1 ? function parseFloat(string) {
      var trimmedString = trim$1(toString$3(string));
      var result = $parseFloat$1(trimmedString);
      return result === 0 && charAt$1(trimmedString, 0) == '-' ? -0 : result;
    } : $parseFloat$1;

    var $$t = _export;
    var $parseFloat = numberParseFloat;

    // `parseFloat` method
    // https://tc39.es/ecma262/#sec-parsefloat-string
    $$t({ global: true, forced: parseFloat != $parseFloat }, {
      parseFloat: $parseFloat
    });

    var apply$2 = functionApply;
    var call$a = functionCall;
    var uncurryThis$5 = functionUncurryThis;
    var fixRegExpWellKnownSymbolLogic$1 = fixRegexpWellKnownSymbolLogic;
    var anObject$f = anObject$L;
    var isNullOrUndefined$1 = isNullOrUndefined$9;
    var isRegExp$1 = isRegexp;
    var requireObjectCoercible$1 = requireObjectCoercible$8;
    var speciesConstructor$4 = speciesConstructor$b;
    var advanceStringIndex$1 = advanceStringIndex$3;
    var toLength$1 = toLength$4;
    var toString$2 = toString$f;
    var getMethod$1 = getMethod$6;
    var arraySlice$3 = arraySliceSimple;
    var callRegExpExec = regexpExecAbstract;
    var regexpExec = regexpExec$3;
    var stickyHelpers$1 = regexpStickyHelpers;
    var fails$7 = fails$G;

    var UNSUPPORTED_Y$1 = stickyHelpers$1.UNSUPPORTED_Y;
    var MAX_UINT32 = 0xFFFFFFFF;
    var min = Math.min;
    var $push = [].push;
    var exec$1 = uncurryThis$5(/./.exec);
    var push$1 = uncurryThis$5($push);
    var stringSlice$1 = uncurryThis$5(''.slice);

    // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
    // Weex JS has frozen built-in prototypes, so use try / catch wrapper
    var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$7(function () {
      // eslint-disable-next-line regexp/no-empty-group -- required for testing
      var re = /(?:)/;
      var originalExec = re.exec;
      re.exec = function () { return originalExec.apply(this, arguments); };
      var result = 'ab'.split(re);
      return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
    });

    // @@split logic
    fixRegExpWellKnownSymbolLogic$1('split', function (SPLIT, nativeSplit, maybeCallNative) {
      var internalSplit;
      if (
        'abbc'.split(/(b)*/)[1] == 'c' ||
        // eslint-disable-next-line regexp/no-empty-group -- required for testing
        'test'.split(/(?:)/, -1).length != 4 ||
        'ab'.split(/(?:ab)*/).length != 2 ||
        '.'.split(/(.?)(.?)/).length != 4 ||
        // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
        '.'.split(/()()/).length > 1 ||
        ''.split(/.?/).length
      ) {
        // based on es5-shim implementation, need to rework it
        internalSplit = function (separator, limit) {
          var string = toString$2(requireObjectCoercible$1(this));
          var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
          if (lim === 0) return [];
          if (separator === undefined) return [string];
          // If `separator` is not a regex, use native split
          if (!isRegExp$1(separator)) {
            return call$a(nativeSplit, string, separator, lim);
          }
          var output = [];
          var flags = (separator.ignoreCase ? 'i' : '') +
                      (separator.multiline ? 'm' : '') +
                      (separator.unicode ? 'u' : '') +
                      (separator.sticky ? 'y' : '');
          var lastLastIndex = 0;
          // Make `global` and avoid `lastIndex` issues by working with a copy
          var separatorCopy = new RegExp(separator.source, flags + 'g');
          var match, lastIndex, lastLength;
          while (match = call$a(regexpExec, separatorCopy, string)) {
            lastIndex = separatorCopy.lastIndex;
            if (lastIndex > lastLastIndex) {
              push$1(output, stringSlice$1(string, lastLastIndex, match.index));
              if (match.length > 1 && match.index < string.length) apply$2($push, output, arraySlice$3(match, 1));
              lastLength = match[0].length;
              lastLastIndex = lastIndex;
              if (output.length >= lim) break;
            }
            if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
          }
          if (lastLastIndex === string.length) {
            if (lastLength || !exec$1(separatorCopy, '')) push$1(output, '');
          } else push$1(output, stringSlice$1(string, lastLastIndex));
          return output.length > lim ? arraySlice$3(output, 0, lim) : output;
        };
      // Chakra, V8
      } else if ('0'.split(undefined, 0).length) {
        internalSplit = function (separator, limit) {
          return separator === undefined && limit === 0 ? [] : call$a(nativeSplit, this, separator, limit);
        };
      } else internalSplit = nativeSplit;

      return [
        // `String.prototype.split` method
        // https://tc39.es/ecma262/#sec-string.prototype.split
        function split(separator, limit) {
          var O = requireObjectCoercible$1(this);
          var splitter = isNullOrUndefined$1(separator) ? undefined : getMethod$1(separator, SPLIT);
          return splitter
            ? call$a(splitter, separator, O, limit)
            : call$a(internalSplit, toString$2(O), separator, limit);
        },
        // `RegExp.prototype[@@split]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
        //
        // NOTE: This cannot be properly polyfilled in engines that don't support
        // the 'y' flag.
        function (string, limit) {
          var rx = anObject$f(this);
          var S = toString$2(string);
          var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

          if (res.done) return res.value;

          var C = speciesConstructor$4(rx, RegExp);

          var unicodeMatching = rx.unicode;
          var flags = (rx.ignoreCase ? 'i' : '') +
                      (rx.multiline ? 'm' : '') +
                      (rx.unicode ? 'u' : '') +
                      (UNSUPPORTED_Y$1 ? 'g' : 'y');

          // ^(? + rx + ) is needed, in combination with some S slicing, to
          // simulate the 'y' flag.
          var splitter = new C(UNSUPPORTED_Y$1 ? '^(?:' + rx.source + ')' : rx, flags);
          var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
          if (lim === 0) return [];
          if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
          var p = 0;
          var q = 0;
          var A = [];
          while (q < S.length) {
            splitter.lastIndex = UNSUPPORTED_Y$1 ? 0 : q;
            var z = callRegExpExec(splitter, UNSUPPORTED_Y$1 ? stringSlice$1(S, q) : S);
            var e;
            if (
              z === null ||
              (e = min(toLength$1(splitter.lastIndex + (UNSUPPORTED_Y$1 ? q : 0)), S.length)) === p
            ) {
              q = advanceStringIndex$1(S, q, unicodeMatching);
            } else {
              push$1(A, stringSlice$1(S, p, q));
              if (A.length === lim) return A;
              for (var i = 1; i <= z.length - 1; i++) {
                push$1(A, z[i]);
                if (A.length === lim) return A;
              }
              q = p = e;
            }
          }
          push$1(A, stringSlice$1(S, p));
          return A;
        }
      ];
    }, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y$1);

    Object.defineProperty(reusables, "__esModule", {
      value: true
    });
    reusables.isArrayOfType = isArrayOfType;
    reusables.isNumber = isNumber;
    reusables.arrayEqual = arrayEqual;
    reusables.transpose = transpose;
    reusables.makeGenerator = makeGenerator;
    reusables.iter = iter;
    reusables.chain = chain;
    reusables.xSplit = xSplit;
    reusables.xReplace = xReplace;
    reusables.xContains = xContains;
    reusables.hashCode = hashCode;



    var _marked = regeneratorRuntime.mark(makeGenerator),
        _marked2 = regeneratorRuntime.mark(createIterGenerator);

    function _toConsumableArray$5(arr) { return _arrayWithoutHoles$5(arr) || _iterableToArray$5(arr) || _nonIterableSpread$5(); }

    function _nonIterableSpread$5() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

    function _iterableToArray$5(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

    function _arrayWithoutHoles$5(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

    function isArrayOfType(value, ofType) {
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return value instanceof Array && value.hasOwnProperty(index) && (ofType === String ? typeof value[index] === "string" : value[index] instanceof ofType) ? true : false;
    }

    function isNumber(x) {
      return !isNaN(parseFloat(x)) && isFinite(x);
    }

    function arrayEqual(a, b) {
      var byOrder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      return byOrder ? Object.keys(a).map(function (x) {
        return a[x] === b[x];
      }).reduce(function (p, n) {
        return p ? n : p;
      }, true) : _toConsumableArray$5(new Set(a.filter(function (x) {
        return !new Set(b).has(x);
      }))).length === 0;
    }

    function transpose(table) {
      var tableSize = table.map(function (row) {
        return row.length;
      }).reduce(function (p, n) {
        return Math.max(p, n);
      }, 0);
      return _toConsumableArray$5(Array(tableSize).keys()).map(function (index) {
        return table.map(function (row) {
          return row[index];
        });
      });
    }

    function makeGenerator(x) {
      return regeneratorRuntime.wrap(function makeGenerator$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.delegateYield(x, "t0", 1);

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _marked);
    }

    function createIterGenerator(data, func) {
      var abort,
          i,
          _iteratorNormalCompletion,
          _didIteratorError,
          _iteratorError,
          _iterator,
          _step,
          iteration,
          modifiedRow,
          _args2 = arguments;

      return regeneratorRuntime.wrap(function createIterGenerator$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              abort = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : function () {
                return false;
              };
              i = 0;
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context2.prev = 5;
              _iterator = data[Symbol.iterator]();

            case 7:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context2.next = 18;
                break;
              }

              iteration = _step.value;

              if (!abort()) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt("return");

            case 11:
              modifiedRow = func(iteration, i++);

              if (!modifiedRow) {
                _context2.next = 15;
                break;
              }

              _context2.next = 15;
              return modifiedRow;

            case 15:
              _iteratorNormalCompletion = true;
              _context2.next = 7;
              break;

            case 18:
              _context2.next = 24;
              break;

            case 20:
              _context2.prev = 20;
              _context2.t0 = _context2["catch"](5);
              _didIteratorError = true;
              _iteratorError = _context2.t0;

            case 24:
              _context2.prev = 24;
              _context2.prev = 25;

              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }

            case 27:
              _context2.prev = 27;

              if (!_didIteratorError) {
                _context2.next = 30;
                break;
              }

              throw _iteratorError;

            case 30:
              return _context2.finish(27);

            case 31:
              return _context2.finish(24);

            case 32:
            case "end":
              return _context2.stop();
          }
        }
      }, _marked2, null, [[5, 20, 24, 32], [25,, 27, 31]]);
    }

    function iter(data, func) {
      var abort = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
        return false;
      };
      return Array.from(createIterGenerator(data, func, abort));
    }

    function chain(data) {
      for (var _len = arguments.length, operations = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        operations[_key - 1] = arguments[_key];
      }

      return Array.from(iter(data, operations.reduce(function (p, n) {
        return function (x, i) {
          var prev = p(x, i);
          var next = prev ? n(prev, i) : false;
          return next === true ? prev : next;
        };
      }, function (x) {
        return x;
      })));
    }

    function xSplit(stringToSplit) {
      for (var _len2 = arguments.length, patterns = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        patterns[_key2 - 1] = arguments[_key2];
      }

      return patterns.reduce(function (prev, next) {
        return prev.map(function (str) {
          return str.split(next);
        }).reduce(function (p, n) {
          return [].concat(_toConsumableArray$5(p), _toConsumableArray$5(n));
        }, []);
      }, [stringToSplit]);
    }

    function xReplace(stringToReplace) {
      for (var _len3 = arguments.length, patterns = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        patterns[_key3 - 1] = arguments[_key3];
      }

      return patterns.reduce(function (prev, next) {
        return prev.split(next[0]).join(next[1]);
      }, stringToReplace);
    }

    function xContains(stringToFilter) {
      for (var _len4 = arguments.length, patterns = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        patterns[_key4 - 1] = arguments[_key4];
      }

      return patterns.filter(function (pattern) {
        return stringToFilter.includes(pattern);
      });
    }

    function hashCode(str) {
      var hash = 0;
      var char;
      if (str.length === 0) return hash;

      for (var i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }

      return hash;
    }

    var errors = {};

    /* eslint-disable es/no-array-prototype-indexof -- required for testing */
    var $$s = _export;
    var uncurryThis$4 = functionUncurryThisClause;
    var $indexOf = arrayIncludes.indexOf;
    var arrayMethodIsStrict = arrayMethodIsStrict$6;

    var nativeIndexOf = uncurryThis$4([].indexOf);

    var NEGATIVE_ZERO = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
    var STRICT_METHOD = arrayMethodIsStrict('indexOf');

    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    $$s({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD }, {
      indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
        var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
        return NEGATIVE_ZERO
          // convert -0 to +0
          ? nativeIndexOf(this, searchElement, fromIndex) || 0
          : $indexOf(this, searchElement, fromIndex);
      }
    });

    var collection = collection$2;
    var collectionStrong = collectionStrong$2;

    // `Map` constructor
    // https://tc39.es/ecma262/#sec-map-objects
    collection('Map', function (init) {
      return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
    }, collectionStrong);

    var $$r = _export;
    var fails$6 = fails$G;
    var toObject = toObject$d;
    var nativeGetPrototypeOf = objectGetPrototypeOf;
    var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

    var FAILS_ON_PRIMITIVES$1 = fails$6(function () { nativeGetPrototypeOf(1); });

    // `Object.getPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.getprototypeof
    $$r({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1, sham: !CORRECT_PROTOTYPE_GETTER }, {
      getPrototypeOf: function getPrototypeOf(it) {
        return nativeGetPrototypeOf(toObject(it));
      }
    });

    var $$q = _export;
    var setPrototypeOf$1 = objectSetPrototypeOf;

    // `Object.setPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.setprototypeof
    $$q({ target: 'Object', stat: true }, {
      setPrototypeOf: setPrototypeOf$1
    });

    var uncurryThis$3 = functionUncurryThis;
    var aCallable$a = aCallable$s;
    var isObject$4 = isObject$k;
    var hasOwn$3 = hasOwnProperty_1;
    var arraySlice$2 = arraySlice$6;
    var NATIVE_BIND = functionBindNative;

    var $Function = Function;
    var concat = uncurryThis$3([].concat);
    var join = uncurryThis$3([].join);
    var factories = {};

    var construct = function (C, argsLength, args) {
      if (!hasOwn$3(factories, argsLength)) {
        for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
        factories[argsLength] = $Function('C,a', 'return new C(' + join(list, ',') + ')');
      } return factories[argsLength](C, args);
    };

    // `Function.prototype.bind` method implementation
    // https://tc39.es/ecma262/#sec-function.prototype.bind
    var functionBind = NATIVE_BIND ? $Function.bind : function bind(that /* , ...args */) {
      var F = aCallable$a(this);
      var Prototype = F.prototype;
      var partArgs = arraySlice$2(arguments, 1);
      var boundFunction = function bound(/* args... */) {
        var args = concat(partArgs, arraySlice$2(arguments));
        return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
      };
      if (isObject$4(Prototype)) boundFunction.prototype = Prototype;
      return boundFunction;
    };

    var $$p = _export;
    var getBuiltIn$5 = getBuiltIn$m;
    var apply$1 = functionApply;
    var bind$a = functionBind;
    var aConstructor = aConstructor$2;
    var anObject$e = anObject$L;
    var isObject$3 = isObject$k;
    var create = objectCreate;
    var fails$5 = fails$G;

    var nativeConstruct = getBuiltIn$5('Reflect', 'construct');
    var ObjectPrototype = Object.prototype;
    var push = [].push;

    // `Reflect.construct` method
    // https://tc39.es/ecma262/#sec-reflect.construct
    // MS Edge supports only 2 arguments and argumentsList argument is optional
    // FF Nightly sets third argument as `new.target`, but does not create `this` from it
    var NEW_TARGET_BUG = fails$5(function () {
      function F() { /* empty */ }
      return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
    });

    var ARGS_BUG = !fails$5(function () {
      nativeConstruct(function () { /* empty */ });
    });

    var FORCED = NEW_TARGET_BUG || ARGS_BUG;

    $$p({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
      construct: function construct(Target, args /* , newTarget */) {
        aConstructor(Target);
        anObject$e(args);
        var newTarget = arguments.length < 3 ? Target : aConstructor(arguments[2]);
        if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
        if (Target == newTarget) {
          // w/o altered newTarget, optimization for 0-4 arguments
          switch (args.length) {
            case 0: return new Target();
            case 1: return new Target(args[0]);
            case 2: return new Target(args[0], args[1]);
            case 3: return new Target(args[0], args[1], args[2]);
            case 4: return new Target(args[0], args[1], args[2], args[3]);
          }
          // w/o altered newTarget, lot of arguments case
          var $args = [null];
          apply$1(push, $args, args);
          return new (apply$1(bind$a, Target, $args))();
        }
        // with altered newTarget, not support built-in constructors
        var proto = newTarget.prototype;
        var instance = create(isObject$3(proto) ? proto : ObjectPrototype);
        var result = apply$1(Target, instance, args);
        return isObject$3(result) ? result : instance;
      }
    });

    var $$o = _export;
    var deleteAll = collectionDeleteAll;

    // `Map.prototype.deleteAll` method
    // https://github.com/tc39/proposal-collection-methods
    $$o({ target: 'Map', proto: true, real: true, forced: true }, {
      deleteAll: deleteAll
    });

    var call$9 = functionCall;

    var getMapIterator$a = function (it) {
      // eslint-disable-next-line es/no-map -- safe
      return call$9(Map.prototype.entries, it);
    };

    var $$n = _export;
    var anObject$d = anObject$L;
    var bind$9 = functionBindContext;
    var getMapIterator$9 = getMapIterator$a;
    var iterate$c = iterate$t;

    // `Map.prototype.every` method
    // https://github.com/tc39/proposal-collection-methods
    $$n({ target: 'Map', proto: true, real: true, forced: true }, {
      every: function every(callbackfn /* , thisArg */) {
        var map = anObject$d(this);
        var iterator = getMapIterator$9(map);
        var boundFunction = bind$9(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        return !iterate$c(iterator, function (key, value, stop) {
          if (!boundFunction(value, key, map)) return stop();
        }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).stopped;
      }
    });

    var $$m = _export;
    var getBuiltIn$4 = getBuiltIn$m;
    var bind$8 = functionBindContext;
    var call$8 = functionCall;
    var aCallable$9 = aCallable$s;
    var anObject$c = anObject$L;
    var speciesConstructor$3 = speciesConstructor$b;
    var getMapIterator$8 = getMapIterator$a;
    var iterate$b = iterate$t;

    // `Map.prototype.filter` method
    // https://github.com/tc39/proposal-collection-methods
    $$m({ target: 'Map', proto: true, real: true, forced: true }, {
      filter: function filter(callbackfn /* , thisArg */) {
        var map = anObject$c(this);
        var iterator = getMapIterator$8(map);
        var boundFunction = bind$8(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        var newMap = new (speciesConstructor$3(map, getBuiltIn$4('Map')))();
        var setter = aCallable$9(newMap.set);
        iterate$b(iterator, function (key, value) {
          if (boundFunction(value, key, map)) call$8(setter, newMap, key, value);
        }, { AS_ENTRIES: true, IS_ITERATOR: true });
        return newMap;
      }
    });

    var $$l = _export;
    var anObject$b = anObject$L;
    var bind$7 = functionBindContext;
    var getMapIterator$7 = getMapIterator$a;
    var iterate$a = iterate$t;

    // `Map.prototype.find` method
    // https://github.com/tc39/proposal-collection-methods
    $$l({ target: 'Map', proto: true, real: true, forced: true }, {
      find: function find(callbackfn /* , thisArg */) {
        var map = anObject$b(this);
        var iterator = getMapIterator$7(map);
        var boundFunction = bind$7(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        return iterate$a(iterator, function (key, value, stop) {
          if (boundFunction(value, key, map)) return stop(value);
        }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).result;
      }
    });

    var $$k = _export;
    var anObject$a = anObject$L;
    var bind$6 = functionBindContext;
    var getMapIterator$6 = getMapIterator$a;
    var iterate$9 = iterate$t;

    // `Map.prototype.findKey` method
    // https://github.com/tc39/proposal-collection-methods
    $$k({ target: 'Map', proto: true, real: true, forced: true }, {
      findKey: function findKey(callbackfn /* , thisArg */) {
        var map = anObject$a(this);
        var iterator = getMapIterator$6(map);
        var boundFunction = bind$6(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        return iterate$9(iterator, function (key, value, stop) {
          if (boundFunction(value, key, map)) return stop(key);
        }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).result;
      }
    });

    // `SameValueZero` abstract operation
    // https://tc39.es/ecma262/#sec-samevaluezero
    var sameValueZero$1 = function (x, y) {
      // eslint-disable-next-line no-self-compare -- NaN check
      return x === y || x != x && y != y;
    };

    var $$j = _export;
    var anObject$9 = anObject$L;
    var getMapIterator$5 = getMapIterator$a;
    var sameValueZero = sameValueZero$1;
    var iterate$8 = iterate$t;

    // `Map.prototype.includes` method
    // https://github.com/tc39/proposal-collection-methods
    $$j({ target: 'Map', proto: true, real: true, forced: true }, {
      includes: function includes(searchElement) {
        return iterate$8(getMapIterator$5(anObject$9(this)), function (key, value, stop) {
          if (sameValueZero(value, searchElement)) return stop();
        }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).stopped;
      }
    });

    var $$i = _export;
    var anObject$8 = anObject$L;
    var getMapIterator$4 = getMapIterator$a;
    var iterate$7 = iterate$t;

    // `Map.prototype.keyOf` method
    // https://github.com/tc39/proposal-collection-methods
    $$i({ target: 'Map', proto: true, real: true, forced: true }, {
      keyOf: function keyOf(searchElement) {
        return iterate$7(getMapIterator$4(anObject$8(this)), function (key, value, stop) {
          if (value === searchElement) return stop(key);
        }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).result;
      }
    });

    var $$h = _export;
    var getBuiltIn$3 = getBuiltIn$m;
    var bind$5 = functionBindContext;
    var call$7 = functionCall;
    var aCallable$8 = aCallable$s;
    var anObject$7 = anObject$L;
    var speciesConstructor$2 = speciesConstructor$b;
    var getMapIterator$3 = getMapIterator$a;
    var iterate$6 = iterate$t;

    // `Map.prototype.mapKeys` method
    // https://github.com/tc39/proposal-collection-methods
    $$h({ target: 'Map', proto: true, real: true, forced: true }, {
      mapKeys: function mapKeys(callbackfn /* , thisArg */) {
        var map = anObject$7(this);
        var iterator = getMapIterator$3(map);
        var boundFunction = bind$5(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        var newMap = new (speciesConstructor$2(map, getBuiltIn$3('Map')))();
        var setter = aCallable$8(newMap.set);
        iterate$6(iterator, function (key, value) {
          call$7(setter, newMap, boundFunction(value, key, map), value);
        }, { AS_ENTRIES: true, IS_ITERATOR: true });
        return newMap;
      }
    });

    var $$g = _export;
    var getBuiltIn$2 = getBuiltIn$m;
    var bind$4 = functionBindContext;
    var call$6 = functionCall;
    var aCallable$7 = aCallable$s;
    var anObject$6 = anObject$L;
    var speciesConstructor$1 = speciesConstructor$b;
    var getMapIterator$2 = getMapIterator$a;
    var iterate$5 = iterate$t;

    // `Map.prototype.mapValues` method
    // https://github.com/tc39/proposal-collection-methods
    $$g({ target: 'Map', proto: true, real: true, forced: true }, {
      mapValues: function mapValues(callbackfn /* , thisArg */) {
        var map = anObject$6(this);
        var iterator = getMapIterator$2(map);
        var boundFunction = bind$4(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        var newMap = new (speciesConstructor$1(map, getBuiltIn$2('Map')))();
        var setter = aCallable$7(newMap.set);
        iterate$5(iterator, function (key, value) {
          call$6(setter, newMap, key, boundFunction(value, key, map));
        }, { AS_ENTRIES: true, IS_ITERATOR: true });
        return newMap;
      }
    });

    var $$f = _export;
    var aCallable$6 = aCallable$s;
    var anObject$5 = anObject$L;
    var iterate$4 = iterate$t;

    // `Map.prototype.merge` method
    // https://github.com/tc39/proposal-collection-methods
    $$f({ target: 'Map', proto: true, real: true, arity: 1, forced: true }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      merge: function merge(iterable /* ...iterables */) {
        var map = anObject$5(this);
        var setter = aCallable$6(map.set);
        var argumentsLength = arguments.length;
        var i = 0;
        while (i < argumentsLength) {
          iterate$4(arguments[i++], setter, { that: map, AS_ENTRIES: true });
        }
        return map;
      }
    });

    var $$e = _export;
    var anObject$4 = anObject$L;
    var aCallable$5 = aCallable$s;
    var getMapIterator$1 = getMapIterator$a;
    var iterate$3 = iterate$t;

    var $TypeError$3 = TypeError;

    // `Map.prototype.reduce` method
    // https://github.com/tc39/proposal-collection-methods
    $$e({ target: 'Map', proto: true, real: true, forced: true }, {
      reduce: function reduce(callbackfn /* , initialValue */) {
        var map = anObject$4(this);
        var iterator = getMapIterator$1(map);
        var noInitial = arguments.length < 2;
        var accumulator = noInitial ? undefined : arguments[1];
        aCallable$5(callbackfn);
        iterate$3(iterator, function (key, value) {
          if (noInitial) {
            noInitial = false;
            accumulator = value;
          } else {
            accumulator = callbackfn(accumulator, value, key, map);
          }
        }, { AS_ENTRIES: true, IS_ITERATOR: true });
        if (noInitial) throw $TypeError$3('Reduce of empty map with no initial value');
        return accumulator;
      }
    });

    var $$d = _export;
    var anObject$3 = anObject$L;
    var bind$3 = functionBindContext;
    var getMapIterator = getMapIterator$a;
    var iterate$2 = iterate$t;

    // `Set.prototype.some` method
    // https://github.com/tc39/proposal-collection-methods
    $$d({ target: 'Map', proto: true, real: true, forced: true }, {
      some: function some(callbackfn /* , thisArg */) {
        var map = anObject$3(this);
        var iterator = getMapIterator(map);
        var boundFunction = bind$3(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        return iterate$2(iterator, function (key, value, stop) {
          if (boundFunction(value, key, map)) return stop();
        }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).stopped;
      }
    });

    var $$c = _export;
    var call$5 = functionCall;
    var anObject$2 = anObject$L;
    var aCallable$4 = aCallable$s;

    var $TypeError$2 = TypeError;

    // `Set.prototype.update` method
    // https://github.com/tc39/proposal-collection-methods
    $$c({ target: 'Map', proto: true, real: true, forced: true }, {
      update: function update(key, callback /* , thunk */) {
        var map = anObject$2(this);
        var get = aCallable$4(map.get);
        var has = aCallable$4(map.has);
        var set = aCallable$4(map.set);
        var length = arguments.length;
        aCallable$4(callback);
        var isPresentInMap = call$5(has, map, key);
        if (!isPresentInMap && length < 3) {
          throw $TypeError$2('Updating absent value');
        }
        var value = isPresentInMap ? call$5(get, map, key) : aCallable$4(length > 2 ? arguments[2] : undefined)(key, map);
        call$5(set, map, key, callback(value, key, map));
        return map;
      }
    });

    Object.defineProperty(errors, "__esModule", {
      value: true
    });
    errors.WrongTableNameError = errors.TableAlreadyExistsError = errors.SQLParseError = errors.ArgumentTypeError = errors.WrongSchemaError = errors.NoSuchColumnError = errors.MixedTypeError = errors.FileNotFoundError = void 0;

    function _typeof$1(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

    function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

    function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

    function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

    function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

    function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

    function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

    function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

    var FileNotFoundError = function (_Error) {
      _inherits(FileNotFoundError, _Error);

      function FileNotFoundError(fileName) {
        var _this;

        _classCallCheck$6(this, FileNotFoundError);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(FileNotFoundError).call(this, Error));
        _this.message = "".concat(fileName, " not found. You maybe use a wrong path or url. Be sure you use absolute path, relative one being not supported.");
        _this.name = "FileNotFoundError";
        return _this;
      }

      return FileNotFoundError;
    }(_wrapNativeSuper(Error));

    errors.FileNotFoundError = FileNotFoundError;

    var MixedTypeError = function (_TypeError) {
      _inherits(MixedTypeError, _TypeError);

      function MixedTypeError() {
        var _this2;

        _classCallCheck$6(this, MixedTypeError);

        _this2 = _possibleConstructorReturn(this, _getPrototypeOf(MixedTypeError).call(this, TypeError));

        for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
          types[_key] = arguments[_key];
        }

        _this2.message = "can't work with multiple variable types: [".concat(types.join(","), "].");
        _this2.name = "MixedTypeError";
        return _this2;
      }

      return MixedTypeError;
    }(_wrapNativeSuper(TypeError));

    errors.MixedTypeError = MixedTypeError;

    var NoSuchColumnError = function (_Error2) {
      _inherits(NoSuchColumnError, _Error2);

      function NoSuchColumnError(column, columns) {
        var _this3;

        _classCallCheck$6(this, NoSuchColumnError);

        _this3 = _possibleConstructorReturn(this, _getPrototypeOf(NoSuchColumnError).call(this, Error));
        _this3.message = "".concat(column, " not found in [").concat(columns.join(", "), "].");
        _this3.name = "NoSuchColumnError";
        return _this3;
      }

      return NoSuchColumnError;
    }(_wrapNativeSuper(Error));

    errors.NoSuchColumnError = NoSuchColumnError;

    var WrongSchemaError = function (_Error3) {
      _inherits(WrongSchemaError, _Error3);

      function WrongSchemaError(columns, expected) {
        var _this4;

        _classCallCheck$6(this, WrongSchemaError);

        _this4 = _possibleConstructorReturn(this, _getPrototypeOf(WrongSchemaError).call(this, Error));
        _this4.message = "[".concat(columns.join(", "), "] while expecting [").concat(expected.join(", "), "].");
        _this4.name = "WrongSchemaError";
        return _this4;
      }

      return WrongSchemaError;
    }(_wrapNativeSuper(Error));

    errors.WrongSchemaError = WrongSchemaError;

    var ArgumentTypeError = function (_TypeError2) {
      _inherits(ArgumentTypeError, _TypeError2);

      function ArgumentTypeError(input, expected) {
        var _this5;

        _classCallCheck$6(this, ArgumentTypeError);

        _this5 = _possibleConstructorReturn(this, _getPrototypeOf(ArgumentTypeError).call(this, TypeError));
        _this5.message = "".concat(input && input.constructor ? input.constructor.name : _typeof$1(input), " while expecting ").concat(expected, ".");
        _this5.name = "ArgumentTypeError";
        return _this5;
      }

      return ArgumentTypeError;
    }(_wrapNativeSuper(TypeError));

    errors.ArgumentTypeError = ArgumentTypeError;

    var SQLParseError = function (_Error4) {
      _inherits(SQLParseError, _Error4);

      function SQLParseError(message) {
        var _this6;

        _classCallCheck$6(this, SQLParseError);

        _this6 = _possibleConstructorReturn(this, _getPrototypeOf(SQLParseError).call(this, Error));
        _this6.message = "".concat(message, ".");
        _this6.name = "SQLParseError";
        return _this6;
      }

      return SQLParseError;
    }(_wrapNativeSuper(Error));

    errors.SQLParseError = SQLParseError;

    var TableAlreadyExistsError = function (_Error5) {
      _inherits(TableAlreadyExistsError, _Error5);

      function TableAlreadyExistsError(tableName) {
        var _this7;

        _classCallCheck$6(this, TableAlreadyExistsError);

        _this7 = _possibleConstructorReturn(this, _getPrototypeOf(TableAlreadyExistsError).call(this, Error));
        _this7.message = "The SQL temporary table ".concat(tableName, " already exits. Use overwrite = true to overwrite it.");
        _this7.name = "TableAlreadyExistsError";
        return _this7;
      }

      return TableAlreadyExistsError;
    }(_wrapNativeSuper(Error));

    errors.TableAlreadyExistsError = TableAlreadyExistsError;

    var WrongTableNameError = function (_Error6) {
      _inherits(WrongTableNameError, _Error6);

      function WrongTableNameError(tableName) {
        var _this8;

        _classCallCheck$6(this, WrongTableNameError);

        _this8 = _possibleConstructorReturn(this, _getPrototypeOf(WrongTableNameError).call(this, Error));
        _this8.message = "The SQL temporary table ".concat(tableName, " is not allowed. Avoid to use Spaces, quotes, tabs....");
        _this8.name = "WrongTableNameError";
        return _this8;
      }

      return WrongTableNameError;
    }(_wrapNativeSuper(Error));

    errors.WrongTableNameError = WrongTableNameError;

    var row = {};

    var $$b = _export;
    var FREEZING = freezing;
    var fails$4 = fails$G;
    var isObject$2 = isObject$k;
    var onFreeze = internalMetadata.exports.onFreeze;

    // eslint-disable-next-line es/no-object-freeze -- safe
    var $freeze = Object.freeze;
    var FAILS_ON_PRIMITIVES = fails$4(function () { $freeze(1); });

    // `Object.freeze` method
    // https://tc39.es/ecma262/#sec-object.freeze
    $$b({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
      freeze: function freeze(it) {
        return $freeze && isObject$2(it) ? $freeze(onFreeze(it)) : it;
      }
    });

    Object.defineProperty(row, "__esModule", {
      value: true
    });
    row.default = void 0;



    var _reusables$4 = reusables;

    var _errors$5 = errors;

    function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    function _toConsumableArray$4(arr) { return _arrayWithoutHoles$4(arr) || _iterableToArray$4(arr) || _nonIterableSpread$4(); }

    function _nonIterableSpread$4() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

    function _iterableToArray$4(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

    function _arrayWithoutHoles$4(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

    function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties$5(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass$5(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$5(Constructor.prototype, protoProps); if (staticProps) _defineProperties$5(Constructor, staticProps); return Constructor; }

    var __columns__$1 = Symbol("columns");

    var __values__ = Symbol("values");

    var Row = function () {
      function Row(data, columns) {
        _classCallCheck$5(this, Row);

        if (!data) throw new _errors$5.ArgumentTypeError(data, "Row | Array | Object");
        this[__columns__$1] = columns ? columns : Object.keys(data);
        this[__values__] = Object.freeze(this._build(data));
      }

      _createClass$5(Row, [{
        key: Symbol.iterator,
        value: regeneratorRuntime.mark(function value() {
          var _i, _Object$values, value;

          return regeneratorRuntime.wrap(function value$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _i = 0, _Object$values = Object.values(this[__values__]);

                case 1:
                  if (!(_i < _Object$values.length)) {
                    _context.next = 8;
                    break;
                  }

                  value = _Object$values[_i];
                  _context.next = 5;
                  return value;

                case 5:
                  _i++;
                  _context.next = 1;
                  break;

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, value, this);
        })
      }, {
        key: "__newInstance__",
        value: function __newInstance__(data, columns) {
          var _Object$assign;

          if (!(0, _reusables$4.arrayEqual)(this[__columns__$1], columns)) {
            return new Row(data, columns);
          }

          return Object.assign(Object.create(Object.getPrototypeOf(this)), this, (_Object$assign = {}, _defineProperty$2(_Object$assign, __values__, data), _defineProperty$2(_Object$assign, __columns__$1, _toConsumableArray$4(columns)), _Object$assign));
        }
      }, {
        key: "_build",
        value: function _build(data) {
          if (data instanceof Array) return this._fromArray(data);
          if (data instanceof Row) return this._fromObject(data[__values__]);
          if (data instanceof Object && data !== null) return this._fromObject(data);
          throw new _errors$5.ArgumentTypeError(data, "Row | Array | Object");
        }
      }, {
        key: "_fromObject",
        value: function _fromObject(object) {
          return Object.assign.apply(Object, [{}].concat(_toConsumableArray$4(this[__columns__$1].map(function (column) {
            return _defineProperty$2({}, column, object[column]);
          }))));
        }
      }, {
        key: "_fromArray",
        value: function _fromArray(array) {
          return Object.assign.apply(Object, [{}].concat(_toConsumableArray$4(Object.entries(this[__columns__$1]).map(function (column) {
            return _defineProperty$2({}, column[1], array[column[0]]);
          }))));
        }
      }, {
        key: "toDict",
        value: function toDict() {
          return Object.assign({}, this[__values__]);
        }
      }, {
        key: "toArray",
        value: function toArray() {
          return _toConsumableArray$4(this);
        }
      }, {
        key: "size",
        value: function size() {
          return this[__columns__$1].length;
        }
      }, {
        key: "hash",
        value: function hash() {
          return (0, _reusables$4.hashCode)(JSON.stringify(this[__values__]));
        }
      }, {
        key: "has",
        value: function has(columnName) {
          return this[__columns__$1].includes(columnName);
        }
      }, {
        key: "select",
        value: function select() {
          var _this = this;

          for (var _len = arguments.length, columnNames = new Array(_len), _key = 0; _key < _len; _key++) {
            columnNames[_key] = arguments[_key];
          }

          return this.__newInstance__(Object.assign.apply(Object, [{}].concat(_toConsumableArray$4(columnNames.map(function (column) {
            return _defineProperty$2({}, column, _this.get(column));
          })))), columnNames);
        }
      }, {
        key: "get",
        value: function get(columnToGet) {
          if (!this.has(columnToGet)) {
            throw new _errors$5.NoSuchColumnError(columnToGet, this[__columns__$1]);
          }

          return this[__values__][columnToGet];
        }
      }, {
        key: "set",
        value: function set(columnToSet, value) {
          var newRow = Object.assign({}, this[__values__], _defineProperty$2({}, columnToSet, value));
          return this.__newInstance__(newRow, Object.keys(newRow));
        }
      }, {
        key: "delete",
        value: function _delete(columnToDel) {
          if (!this.has(columnToDel)) {
            throw new _errors$5.NoSuchColumnError(columnToDel, this[__columns__$1]);
          }

          return this.select.apply(this, _toConsumableArray$4(this[__columns__$1].filter(function (column) {
            return column !== columnToDel;
          })));
        }
      }]);

      return Row;
    }();

    var _default$4 = Row;
    row.default = _default$4;

    var group = {};

    var $$a = _export;
    var DESCRIPTORS$2 = descriptors;
    var ownKeys$1 = ownKeys$3;
    var toIndexedObject = toIndexedObject$c;
    var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
    var createProperty = createProperty$5;

    // `Object.getOwnPropertyDescriptors` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
    $$a({ target: 'Object', stat: true, sham: !DESCRIPTORS$2 }, {
      getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
        var O = toIndexedObject(object);
        var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
        var keys = ownKeys$1(O);
        var result = {};
        var index = 0;
        var key, descriptor;
        while (keys.length > index) {
          descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
          if (descriptor !== undefined) createProperty(result, key, descriptor);
        }
        return result;
      }
    });

    var symbol = {};

    Object.defineProperty(symbol, "__esModule", {
      value: true
    });
    symbol.__hashes__ = symbol.__groups__ = symbol.__rows__ = symbol.__columns__ = void 0;

    var __columns__ = Symbol("columns");

    symbol.__columns__ = __columns__;

    var __rows__ = Symbol("rows");

    symbol.__rows__ = __rows__;

    var __groups__ = Symbol("groups");

    symbol.__groups__ = __groups__;

    var __hashes__ = Symbol("hashes");

    symbol.__hashes__ = __hashes__;

    Object.defineProperty(group, "__esModule", {
      value: true
    });
    group.groupBy = groupBy;
    group.GroupedDataFrame = void 0;



    var _symbol$2 = symbol;

    function _slicedToArray$2(arr, i) { return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _nonIterableRest$2(); }

    function _nonIterableRest$2() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

    function _iterableToArrayLimit$2(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

    function _arrayWithHoles$2(arr) { if (Array.isArray(arr)) return arr; }

    function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

    function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    function _toConsumableArray$3(arr) { return _arrayWithoutHoles$3(arr) || _iterableToArray$3(arr) || _nonIterableSpread$3(); }

    function _nonIterableSpread$3() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

    function _iterableToArray$3(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

    function _arrayWithoutHoles$3(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

    function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties$4(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass$4(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$4(Constructor.prototype, protoProps); if (staticProps) _defineProperties$4(Constructor, staticProps); return Constructor; }

    var GroupedDataFrame = function () {
      function GroupedDataFrame(df, columnNames, groups, hashes) {
        _classCallCheck$4(this, GroupedDataFrame);

        this[_symbol$2.__groups__] = groups;
        this[_symbol$2.__hashes__] = hashes;
        this.df = df;
        this.on = columnNames.length > 0 ? columnNames : df.listColumns();
      }

      _createClass$4(GroupedDataFrame, [{
        key: Symbol.iterator,
        value: regeneratorRuntime.mark(function value() {
          var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, hash;

          return regeneratorRuntime.wrap(function value$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context.prev = 3;
                  _iterator = this[_symbol$2.__hashes__][Symbol.iterator]();

                case 5:
                  if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _context.next = 12;
                    break;
                  }

                  hash = _step.value;
                  _context.next = 9;
                  return this[_symbol$2.__groups__][hash];

                case 9:
                  _iteratorNormalCompletion = true;
                  _context.next = 5;
                  break;

                case 12:
                  _context.next = 18;
                  break;

                case 14:
                  _context.prev = 14;
                  _context.t0 = _context["catch"](3);
                  _didIteratorError = true;
                  _iteratorError = _context.t0;

                case 18:
                  _context.prev = 18;
                  _context.prev = 19;

                  if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                  }

                case 21:
                  _context.prev = 21;

                  if (!_didIteratorError) {
                    _context.next = 24;
                    break;
                  }

                  throw _iteratorError;

                case 24:
                  return _context.finish(21);

                case 25:
                  return _context.finish(18);

                case 26:
                case "end":
                  return _context.stop();
              }
            }
          }, value, this, [[3, 14, 18, 26], [19,, 21, 25]]);
        })
      }, {
        key: "get",
        value: function get(hash) {
          return this[_symbol$2.__groups__][hash];
        }
      }, {
        key: "toCollection",
        value: function toCollection() {
          return _toConsumableArray$3(this);
        }
      }, {
        key: "show",
        value: function show() {
          var quiet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          return _toConsumableArray$3(this).map(function (_ref) {
            var group = _ref.group,
                groupKey = _ref.groupKey;
            var groupLog = "--\n[".concat(JSON.stringify(groupKey), "]\n--");

            if (!quiet) {
              console.log(groupLog);
            }

            return groupLog + "\n" + group.show(10, quiet);
          }).reduce(function (p, n) {
            return p + "\n" + n;
          });
        }
      }, {
        key: "listGroups",
        value: function listGroups() {
          return _toConsumableArray$3(this).map(function (_ref2) {
            var groupKey = _ref2.groupKey;
            return groupKey;
          });
        }
      }, {
        key: "listHashs",
        value: function listHashs() {
          return this[_symbol$2.__hashes__];
        }
      }, {
        key: "map",
        value: function map(func) {
          var _ref4;

          var mapped = _toConsumableArray$3(this).map(function (_ref3) {
            var group = _ref3.group;
            return group.map(func);
          });

          return this.df.__newInstance__((_ref4 = []).concat.apply(_ref4, _toConsumableArray$3(mapped.map(function (group) {
            return group.toCollection();
          }))), mapped[0].listColumns());
        }
      }, {
        key: "filter",
        value: function filter(condition) {
          var _ref6;

          var mapped = _toConsumableArray$3(this).map(function (_ref5) {
            var group = _ref5.group;
            return group.filter(condition);
          }).filter(function (group) {
            return group.listColumns().length > 0;
          });

          return mapped.length === 0 ? this.df.__newInstance__([], this.df.listColumns()) : this.df.__newInstance__((_ref6 = []).concat.apply(_ref6, _toConsumableArray$3(mapped.map(function (group) {
            return group.toCollection();
          }))), this.df.listColumns());
        }
      }, {
        key: "chain",
        value: function chain() {
          var _ref8;

          for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
            funcs[_key] = arguments[_key];
          }

          var mapped = _toConsumableArray$3(this).map(function (_ref7) {
            var group = _ref7.group;
            return group.chain.apply(group, funcs);
          });

          return this.df.__newInstance__((_ref8 = []).concat.apply(_ref8, _toConsumableArray$3(mapped.map(function (group) {
            return group.toCollection();
          }))), mapped[0].listColumns());
        }
      }, {
        key: "aggregate",
        value: function aggregate(func) {
          var columnName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "aggregation";
          return this.df.__newInstance__(_toConsumableArray$3(this).map(function (_ref9) {
            var group = _ref9.group,
                groupKey = _ref9.groupKey;
            return _objectSpread({}, groupKey, _defineProperty$1({}, columnName, func(group, groupKey)));
          }), [].concat(_toConsumableArray$3(this.on), [columnName]));
        }
      }, {
        key: "pivot",
        value: function pivot(columnToPivot) {
          var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (gdf) {
            return gdf.count();
          };
          var columns = [].concat(_toConsumableArray$3(this.on), _toConsumableArray$3(this.df.distinct(columnToPivot).toArray(columnToPivot)));
          return this.df.__newInstance__(this.aggregate(function (group) {
            return group.groupBy(columnToPivot).aggregate(function (gp, gk) {
              return _defineProperty$1({}, gk[columnToPivot], func(gp, gk));
            }).toArray("aggregation").reduce(function (p, n) {
              return _objectSpread({}, p, {}, n);
            }, {});
          }).toCollection().map(function (_ref11) {
            var aggregation = _ref11.aggregation,
                rest = _objectWithoutProperties(_ref11, ["aggregation"]);

            return _objectSpread({}, rest, {}, aggregation);
          }), columns);
        }
      }, {
        key: "melt",
        value: function melt() {
          var _this = this;

          var variableColumnName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "variable";
          var valueColumnName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "value";
          var columns = [].concat(_toConsumableArray$3(this.on), [variableColumnName, valueColumnName]);
          return this.df.__newInstance__(this.aggregate(function (group) {
            return Object.entries(group.toDict()).reduce(function (tidy, _ref12) {
              var _ref13 = _slicedToArray$2(_ref12, 2),
                  key = _ref13[0],
                  value = _ref13[1];

              return [].concat(_toConsumableArray$3(tidy), _toConsumableArray$3(value.reduce(function (p, n) {
                var _ref14;

                return !_this.on.includes(key) ? [].concat(_toConsumableArray$3(p), [(_ref14 = {}, _defineProperty$1(_ref14, variableColumnName, key), _defineProperty$1(_ref14, valueColumnName, n), _ref14)]) : p;
              }, [])));
            }, []);
          }).toCollection().reduce(function (p, _ref15) {
            var aggregation = _ref15.aggregation,
                rest = _objectWithoutProperties(_ref15, ["aggregation"]);

            return [].concat(_toConsumableArray$3(p), _toConsumableArray$3(aggregation.map(function (x) {
              return _objectSpread({}, rest, {}, x);
            })));
          }, []), columns);
        }
      }]);

      return GroupedDataFrame;
    }();

    group.GroupedDataFrame = GroupedDataFrame;

    function groupBy(df, columnNames) {
      var rowsByGroup = {};
      var hashes = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = df.toCollection(true)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var row = _step2.value;
          var hash = row.select.apply(row, _toConsumableArray$3(columnNames)).hash();

          if (!rowsByGroup[hash]) {
            hashes.push(hash);
            rowsByGroup[hash] = [];
          }

          rowsByGroup[hash].push(row);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var groups = hashes.reduce(function (groups, hash) {
        var _rowsByGroup$hash$;

        groups[hash] = {
          groupKey: (_rowsByGroup$hash$ = rowsByGroup[hash][0]).select.apply(_rowsByGroup$hash$, _toConsumableArray$3(columnNames)).toDict(),
          hash: hash,
          group: new df.constructor(rowsByGroup[hash], df.listColumns())
        };
        return groups;
      }, {});
      return new GroupedDataFrame(df, columnNames, groups, hashes);
    }

    var io$1 = {};

    var $TypeError$1 = TypeError;

    var validateArgumentsLength$1 = function (passed, required) {
      if (passed < required) throw $TypeError$1('Not enough arguments');
      return passed;
    };

    var userAgent$2 = engineUserAgent;

    var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent$2);

    var global$9 = global$u;
    var apply = functionApply;
    var bind$2 = functionBindContext;
    var isCallable$3 = isCallable$r;
    var hasOwn$2 = hasOwnProperty_1;
    var fails$3 = fails$G;
    var html$1 = html$3;
    var arraySlice$1 = arraySlice$6;
    var createElement = documentCreateElement$2;
    var validateArgumentsLength = validateArgumentsLength$1;
    var IS_IOS$1 = engineIsIos;
    var IS_NODE$3 = engineIsNode;

    var set$1 = global$9.setImmediate;
    var clear = global$9.clearImmediate;
    var process$2 = global$9.process;
    var Dispatch$1 = global$9.Dispatch;
    var Function$1 = global$9.Function;
    var MessageChannel = global$9.MessageChannel;
    var String$1 = global$9.String;
    var counter = 0;
    var queue$1 = {};
    var ONREADYSTATECHANGE = 'onreadystatechange';
    var $location, defer, channel, port;

    try {
      // Deno throws a ReferenceError on `location` access without `--location` flag
      $location = global$9.location;
    } catch (error) { /* empty */ }

    var run = function (id) {
      if (hasOwn$2(queue$1, id)) {
        var fn = queue$1[id];
        delete queue$1[id];
        fn();
      }
    };

    var runner = function (id) {
      return function () {
        run(id);
      };
    };

    var listener = function (event) {
      run(event.data);
    };

    var post = function (id) {
      // old engines have not location.origin
      global$9.postMessage(String$1(id), $location.protocol + '//' + $location.host);
    };

    // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
    if (!set$1 || !clear) {
      set$1 = function setImmediate(handler) {
        validateArgumentsLength(arguments.length, 1);
        var fn = isCallable$3(handler) ? handler : Function$1(handler);
        var args = arraySlice$1(arguments, 1);
        queue$1[++counter] = function () {
          apply(fn, undefined, args);
        };
        defer(counter);
        return counter;
      };
      clear = function clearImmediate(id) {
        delete queue$1[id];
      };
      // Node.js 0.8-
      if (IS_NODE$3) {
        defer = function (id) {
          process$2.nextTick(runner(id));
        };
      // Sphere (JS game engine) Dispatch API
      } else if (Dispatch$1 && Dispatch$1.now) {
        defer = function (id) {
          Dispatch$1.now(runner(id));
        };
      // Browsers with MessageChannel, includes WebWorkers
      // except iOS - https://github.com/zloirock/core-js/issues/624
      } else if (MessageChannel && !IS_IOS$1) {
        channel = new MessageChannel();
        port = channel.port2;
        channel.port1.onmessage = listener;
        defer = bind$2(port.postMessage, port);
      // Browsers with postMessage, skip WebWorkers
      // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
      } else if (
        global$9.addEventListener &&
        isCallable$3(global$9.postMessage) &&
        !global$9.importScripts &&
        $location && $location.protocol !== 'file:' &&
        !fails$3(post)
      ) {
        defer = post;
        global$9.addEventListener('message', listener, false);
      // IE8-
      } else if (ONREADYSTATECHANGE in createElement('script')) {
        defer = function (id) {
          html$1.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
            html$1.removeChild(this);
            run(id);
          };
        };
      // Rest old browsers
      } else {
        defer = function (id) {
          setTimeout(runner(id), 0);
        };
      }
    }

    var task$1 = {
      set: set$1,
      clear: clear
    };

    var userAgent$1 = engineUserAgent;
    var global$8 = global$u;

    var engineIsIosPebble = /ipad|iphone|ipod/i.test(userAgent$1) && global$8.Pebble !== undefined;

    var userAgent = engineUserAgent;

    var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(userAgent);

    var global$7 = global$u;
    var bind$1 = functionBindContext;
    var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
    var macrotask = task$1.set;
    var IS_IOS = engineIsIos;
    var IS_IOS_PEBBLE = engineIsIosPebble;
    var IS_WEBOS_WEBKIT = engineIsWebosWebkit;
    var IS_NODE$2 = engineIsNode;

    var MutationObserver = global$7.MutationObserver || global$7.WebKitMutationObserver;
    var document$2 = global$7.document;
    var process$1 = global$7.process;
    var Promise$1 = global$7.Promise;
    // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
    var queueMicrotaskDescriptor = getOwnPropertyDescriptor$1(global$7, 'queueMicrotask');
    var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

    var flush, head, last, notify$1, toggle, node, promise, then;

    // modern engines have queueMicrotask method
    if (!queueMicrotask) {
      flush = function () {
        var parent, fn;
        if (IS_NODE$2 && (parent = process$1.domain)) parent.exit();
        while (head) {
          fn = head.fn;
          head = head.next;
          try {
            fn();
          } catch (error) {
            if (head) notify$1();
            else last = undefined;
            throw error;
          }
        } last = undefined;
        if (parent) parent.enter();
      };

      // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
      // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
      if (!IS_IOS && !IS_NODE$2 && !IS_WEBOS_WEBKIT && MutationObserver && document$2) {
        toggle = true;
        node = document$2.createTextNode('');
        new MutationObserver(flush).observe(node, { characterData: true });
        notify$1 = function () {
          node.data = toggle = !toggle;
        };
      // environments with maybe non-completely correct, but existent Promise
      } else if (!IS_IOS_PEBBLE && Promise$1 && Promise$1.resolve) {
        // Promise.resolve without an argument throws an error in LG WebOS 2
        promise = Promise$1.resolve(undefined);
        // workaround of WebKit ~ iOS Safari 10.1 bug
        promise.constructor = Promise$1;
        then = bind$1(promise.then, promise);
        notify$1 = function () {
          then(flush);
        };
      // Node.js without promises
      } else if (IS_NODE$2) {
        notify$1 = function () {
          process$1.nextTick(flush);
        };
      // for other environments - macrotask based on:
      // - setImmediate
      // - MessageChannel
      // - window.postMessage
      // - onreadystatechange
      // - setTimeout
      } else {
        // strange IE + webpack dev server bug - use .bind(global)
        macrotask = bind$1(macrotask, global$7);
        notify$1 = function () {
          macrotask(flush);
        };
      }
    }

    var microtask$1 = queueMicrotask || function (fn) {
      var task = { fn: fn, next: undefined };
      if (last) last.next = task;
      if (!head) {
        head = task;
        notify$1();
      } last = task;
    };

    var global$6 = global$u;

    var hostReportErrors$1 = function (a, b) {
      var console = global$6.console;
      if (console && console.error) {
        arguments.length == 1 ? console.error(a) : console.error(a, b);
      }
    };

    var perform$3 = function (exec) {
      try {
        return { error: false, value: exec() };
      } catch (error) {
        return { error: true, value: error };
      }
    };

    var Queue$1 = function () {
      this.head = null;
      this.tail = null;
    };

    Queue$1.prototype = {
      add: function (item) {
        var entry = { item: item, next: null };
        if (this.head) this.tail.next = entry;
        else this.head = entry;
        this.tail = entry;
      },
      get: function () {
        var entry = this.head;
        if (entry) {
          this.head = entry.next;
          if (this.tail === entry) this.tail = null;
          return entry.item;
        }
      }
    };

    var queue = Queue$1;

    var global$5 = global$u;

    var promiseNativeConstructor = global$5.Promise;

    /* global Deno -- Deno case */

    var engineIsDeno = typeof Deno == 'object' && Deno && typeof Deno.version == 'object';

    var IS_DENO$1 = engineIsDeno;
    var IS_NODE$1 = engineIsNode;

    var engineIsBrowser = !IS_DENO$1 && !IS_NODE$1
      && typeof window == 'object'
      && typeof document == 'object';

    var global$4 = global$u;
    var NativePromiseConstructor$3 = promiseNativeConstructor;
    var isCallable$2 = isCallable$r;
    var isForced$2 = isForced_1;
    var inspectSource = inspectSource$3;
    var wellKnownSymbol$1 = wellKnownSymbol$q;
    var IS_BROWSER = engineIsBrowser;
    var IS_DENO = engineIsDeno;
    var V8_VERSION = engineV8Version;

    NativePromiseConstructor$3 && NativePromiseConstructor$3.prototype;
    var SPECIES = wellKnownSymbol$1('species');
    var SUBCLASSING = false;
    var NATIVE_PROMISE_REJECTION_EVENT$1 = isCallable$2(global$4.PromiseRejectionEvent);

    var FORCED_PROMISE_CONSTRUCTOR$5 = isForced$2('Promise', function () {
      var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor$3);
      var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor$3);
      // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // We can't detect it synchronously, so just check versions
      if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
      // We can't use @@species feature detection in V8 since it causes
      // deoptimization and performance degradation
      // https://github.com/zloirock/core-js/issues/679
      if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
        // Detect correctness of subclassing with @@species support
        var promise = new NativePromiseConstructor$3(function (resolve) { resolve(1); });
        var FakePromise = function (exec) {
          exec(function () { /* empty */ }, function () { /* empty */ });
        };
        var constructor = promise.constructor = {};
        constructor[SPECIES] = FakePromise;
        SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
        if (!SUBCLASSING) return true;
      // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
      } return !GLOBAL_CORE_JS_PROMISE && (IS_BROWSER || IS_DENO) && !NATIVE_PROMISE_REJECTION_EVENT$1;
    });

    var promiseConstructorDetection = {
      CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR$5,
      REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT$1,
      SUBCLASSING: SUBCLASSING
    };

    var newPromiseCapability$2 = {};

    var aCallable$3 = aCallable$s;

    var $TypeError = TypeError;

    var PromiseCapability = function (C) {
      var resolve, reject;
      this.promise = new C(function ($$resolve, $$reject) {
        if (resolve !== undefined || reject !== undefined) throw $TypeError('Bad Promise constructor');
        resolve = $$resolve;
        reject = $$reject;
      });
      this.resolve = aCallable$3(resolve);
      this.reject = aCallable$3(reject);
    };

    // `NewPromiseCapability` abstract operation
    // https://tc39.es/ecma262/#sec-newpromisecapability
    newPromiseCapability$2.f = function (C) {
      return new PromiseCapability(C);
    };

    var $$9 = _export;
    var IS_NODE = engineIsNode;
    var global$3 = global$u;
    var call$4 = functionCall;
    var defineBuiltIn$3 = defineBuiltIn$f;
    var setPrototypeOf = objectSetPrototypeOf;
    var setToStringTag = setToStringTag$5;
    var setSpecies$1 = setSpecies$3;
    var aCallable$2 = aCallable$s;
    var isCallable$1 = isCallable$r;
    var isObject$1 = isObject$k;
    var anInstance = anInstance$3;
    var speciesConstructor = speciesConstructor$b;
    var task = task$1.set;
    var microtask = microtask$1;
    var hostReportErrors = hostReportErrors$1;
    var perform$2 = perform$3;
    var Queue = queue;
    var InternalStateModule = internalState;
    var NativePromiseConstructor$2 = promiseNativeConstructor;
    var PromiseConstructorDetection = promiseConstructorDetection;
    var newPromiseCapabilityModule$3 = newPromiseCapability$2;

    var PROMISE = 'Promise';
    var FORCED_PROMISE_CONSTRUCTOR$4 = PromiseConstructorDetection.CONSTRUCTOR;
    var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
    var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
    var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
    var setInternalState = InternalStateModule.set;
    var NativePromisePrototype$1 = NativePromiseConstructor$2 && NativePromiseConstructor$2.prototype;
    var PromiseConstructor = NativePromiseConstructor$2;
    var PromisePrototype = NativePromisePrototype$1;
    var TypeError$2 = global$3.TypeError;
    var document$1 = global$3.document;
    var process = global$3.process;
    var newPromiseCapability$1 = newPromiseCapabilityModule$3.f;
    var newGenericPromiseCapability = newPromiseCapability$1;

    var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global$3.dispatchEvent);
    var UNHANDLED_REJECTION = 'unhandledrejection';
    var REJECTION_HANDLED = 'rejectionhandled';
    var PENDING = 0;
    var FULFILLED = 1;
    var REJECTED = 2;
    var HANDLED = 1;
    var UNHANDLED = 2;

    var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

    // helpers
    var isThenable = function (it) {
      var then;
      return isObject$1(it) && isCallable$1(then = it.then) ? then : false;
    };

    var callReaction = function (reaction, state) {
      var value = state.value;
      var ok = state.state == FULFILLED;
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError$2('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            call$4(then, result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    };

    var notify = function (state, isReject) {
      if (state.notified) return;
      state.notified = true;
      microtask(function () {
        var reactions = state.reactions;
        var reaction;
        while (reaction = reactions.get()) {
          callReaction(reaction, state);
        }
        state.notified = false;
        if (isReject && !state.rejection) onUnhandled(state);
      });
    };

    var dispatchEvent = function (name, promise, reason) {
      var event, handler;
      if (DISPATCH_EVENT) {
        event = document$1.createEvent('Event');
        event.promise = promise;
        event.reason = reason;
        event.initEvent(name, false, true);
        global$3.dispatchEvent(event);
      } else event = { promise: promise, reason: reason };
      if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = global$3['on' + name])) handler(event);
      else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
    };

    var onUnhandled = function (state) {
      call$4(task, global$3, function () {
        var promise = state.facade;
        var value = state.value;
        var IS_UNHANDLED = isUnhandled(state);
        var result;
        if (IS_UNHANDLED) {
          result = perform$2(function () {
            if (IS_NODE) {
              process.emit('unhandledRejection', value, promise);
            } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
          });
          // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
          state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
          if (result.error) throw result.value;
        }
      });
    };

    var isUnhandled = function (state) {
      return state.rejection !== HANDLED && !state.parent;
    };

    var onHandleUnhandled = function (state) {
      call$4(task, global$3, function () {
        var promise = state.facade;
        if (IS_NODE) {
          process.emit('rejectionHandled', promise);
        } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
      });
    };

    var bind = function (fn, state, unwrap) {
      return function (value) {
        fn(state, value, unwrap);
      };
    };

    var internalReject = function (state, value, unwrap) {
      if (state.done) return;
      state.done = true;
      if (unwrap) state = unwrap;
      state.value = value;
      state.state = REJECTED;
      notify(state, true);
    };

    var internalResolve = function (state, value, unwrap) {
      if (state.done) return;
      state.done = true;
      if (unwrap) state = unwrap;
      try {
        if (state.facade === value) throw TypeError$2("Promise can't be resolved itself");
        var then = isThenable(value);
        if (then) {
          microtask(function () {
            var wrapper = { done: false };
            try {
              call$4(then, value,
                bind(internalResolve, wrapper, state),
                bind(internalReject, wrapper, state)
              );
            } catch (error) {
              internalReject(wrapper, error, state);
            }
          });
        } else {
          state.value = value;
          state.state = FULFILLED;
          notify(state, false);
        }
      } catch (error) {
        internalReject({ done: false }, error, state);
      }
    };

    // constructor polyfill
    if (FORCED_PROMISE_CONSTRUCTOR$4) {
      // 25.4.3.1 Promise(executor)
      PromiseConstructor = function Promise(executor) {
        anInstance(this, PromisePrototype);
        aCallable$2(executor);
        call$4(Internal, this);
        var state = getInternalPromiseState(this);
        try {
          executor(bind(internalResolve, state), bind(internalReject, state));
        } catch (error) {
          internalReject(state, error);
        }
      };

      PromisePrototype = PromiseConstructor.prototype;

      // eslint-disable-next-line no-unused-vars -- required for `.length`
      Internal = function Promise(executor) {
        setInternalState(this, {
          type: PROMISE,
          done: false,
          notified: false,
          parent: false,
          reactions: new Queue(),
          rejection: false,
          state: PENDING,
          value: undefined
        });
      };

      // `Promise.prototype.then` method
      // https://tc39.es/ecma262/#sec-promise.prototype.then
      Internal.prototype = defineBuiltIn$3(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
        var state = getInternalPromiseState(this);
        var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
        state.parent = true;
        reaction.ok = isCallable$1(onFulfilled) ? onFulfilled : true;
        reaction.fail = isCallable$1(onRejected) && onRejected;
        reaction.domain = IS_NODE ? process.domain : undefined;
        if (state.state == PENDING) state.reactions.add(reaction);
        else microtask(function () {
          callReaction(reaction, state);
        });
        return reaction.promise;
      });

      OwnPromiseCapability = function () {
        var promise = new Internal();
        var state = getInternalPromiseState(promise);
        this.promise = promise;
        this.resolve = bind(internalResolve, state);
        this.reject = bind(internalReject, state);
      };

      newPromiseCapabilityModule$3.f = newPromiseCapability$1 = function (C) {
        return C === PromiseConstructor || C === PromiseWrapper
          ? new OwnPromiseCapability(C)
          : newGenericPromiseCapability(C);
      };

      if (isCallable$1(NativePromiseConstructor$2) && NativePromisePrototype$1 !== Object.prototype) {
        nativeThen = NativePromisePrototype$1.then;

        if (!NATIVE_PROMISE_SUBCLASSING) {
          // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
          defineBuiltIn$3(NativePromisePrototype$1, 'then', function then(onFulfilled, onRejected) {
            var that = this;
            return new PromiseConstructor(function (resolve, reject) {
              call$4(nativeThen, that, resolve, reject);
            }).then(onFulfilled, onRejected);
          // https://github.com/zloirock/core-js/issues/640
          }, { unsafe: true });
        }

        // make `.constructor === Promise` work for native promise-based APIs
        try {
          delete NativePromisePrototype$1.constructor;
        } catch (error) { /* empty */ }

        // make `instanceof Promise` work for native promise-based APIs
        if (setPrototypeOf) {
          setPrototypeOf(NativePromisePrototype$1, PromisePrototype);
        }
      }
    }

    $$9({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR$4 }, {
      Promise: PromiseConstructor
    });

    setToStringTag(PromiseConstructor, PROMISE, false);
    setSpecies$1(PROMISE);

    var NativePromiseConstructor$1 = promiseNativeConstructor;
    var checkCorrectnessOfIteration = checkCorrectnessOfIteration$3;
    var FORCED_PROMISE_CONSTRUCTOR$3 = promiseConstructorDetection.CONSTRUCTOR;

    var promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR$3 || !checkCorrectnessOfIteration(function (iterable) {
      NativePromiseConstructor$1.all(iterable).then(undefined, function () { /* empty */ });
    });

    var $$8 = _export;
    var call$3 = functionCall;
    var aCallable$1 = aCallable$s;
    var newPromiseCapabilityModule$2 = newPromiseCapability$2;
    var perform$1 = perform$3;
    var iterate$1 = iterate$t;
    var PROMISE_STATICS_INCORRECT_ITERATION$1 = promiseStaticsIncorrectIteration;

    // `Promise.all` method
    // https://tc39.es/ecma262/#sec-promise.all
    $$8({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION$1 }, {
      all: function all(iterable) {
        var C = this;
        var capability = newPromiseCapabilityModule$2.f(C);
        var resolve = capability.resolve;
        var reject = capability.reject;
        var result = perform$1(function () {
          var $promiseResolve = aCallable$1(C.resolve);
          var values = [];
          var counter = 0;
          var remaining = 1;
          iterate$1(iterable, function (promise) {
            var index = counter++;
            var alreadyCalled = false;
            remaining++;
            call$3($promiseResolve, C, promise).then(function (value) {
              if (alreadyCalled) return;
              alreadyCalled = true;
              values[index] = value;
              --remaining || resolve(values);
            }, reject);
          });
          --remaining || resolve(values);
        });
        if (result.error) reject(result.value);
        return capability.promise;
      }
    });

    var $$7 = _export;
    var FORCED_PROMISE_CONSTRUCTOR$2 = promiseConstructorDetection.CONSTRUCTOR;
    var NativePromiseConstructor = promiseNativeConstructor;
    var getBuiltIn$1 = getBuiltIn$m;
    var isCallable = isCallable$r;
    var defineBuiltIn$2 = defineBuiltIn$f;

    var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

    // `Promise.prototype.catch` method
    // https://tc39.es/ecma262/#sec-promise.prototype.catch
    $$7({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR$2, real: true }, {
      'catch': function (onRejected) {
        return this.then(undefined, onRejected);
      }
    });

    // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
    if (isCallable(NativePromiseConstructor)) {
      var method = getBuiltIn$1('Promise').prototype['catch'];
      if (NativePromisePrototype['catch'] !== method) {
        defineBuiltIn$2(NativePromisePrototype, 'catch', method, { unsafe: true });
      }
    }

    var $$6 = _export;
    var call$2 = functionCall;
    var aCallable = aCallable$s;
    var newPromiseCapabilityModule$1 = newPromiseCapability$2;
    var perform = perform$3;
    var iterate = iterate$t;
    var PROMISE_STATICS_INCORRECT_ITERATION = promiseStaticsIncorrectIteration;

    // `Promise.race` method
    // https://tc39.es/ecma262/#sec-promise.race
    $$6({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
      race: function race(iterable) {
        var C = this;
        var capability = newPromiseCapabilityModule$1.f(C);
        var reject = capability.reject;
        var result = perform(function () {
          var $promiseResolve = aCallable(C.resolve);
          iterate(iterable, function (promise) {
            call$2($promiseResolve, C, promise).then(capability.resolve, reject);
          });
        });
        if (result.error) reject(result.value);
        return capability.promise;
      }
    });

    var $$5 = _export;
    var call$1 = functionCall;
    var newPromiseCapabilityModule = newPromiseCapability$2;
    var FORCED_PROMISE_CONSTRUCTOR$1 = promiseConstructorDetection.CONSTRUCTOR;

    // `Promise.reject` method
    // https://tc39.es/ecma262/#sec-promise.reject
    $$5({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR$1 }, {
      reject: function reject(r) {
        var capability = newPromiseCapabilityModule.f(this);
        call$1(capability.reject, undefined, r);
        return capability.promise;
      }
    });

    var anObject$1 = anObject$L;
    var isObject = isObject$k;
    var newPromiseCapability = newPromiseCapability$2;

    var promiseResolve$1 = function (C, x) {
      anObject$1(C);
      if (isObject(x) && x.constructor === C) return x;
      var promiseCapability = newPromiseCapability.f(C);
      var resolve = promiseCapability.resolve;
      resolve(x);
      return promiseCapability.promise;
    };

    var $$4 = _export;
    var getBuiltIn = getBuiltIn$m;
    var FORCED_PROMISE_CONSTRUCTOR = promiseConstructorDetection.CONSTRUCTOR;
    var promiseResolve = promiseResolve$1;

    getBuiltIn('Promise');

    // `Promise.resolve` method
    // https://tc39.es/ecma262/#sec-promise.resolve
    $$4({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
      resolve: function resolve(x) {
        return promiseResolve(this, x);
      }
    });

    var call = functionCall;
    var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
    var anObject = anObject$L;
    var isNullOrUndefined = isNullOrUndefined$9;
    var toLength = toLength$4;
    var toString$1 = toString$f;
    var requireObjectCoercible = requireObjectCoercible$8;
    var getMethod = getMethod$6;
    var advanceStringIndex = advanceStringIndex$3;
    var regExpExec = regexpExecAbstract;

    // @@match logic
    fixRegExpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
      return [
        // `String.prototype.match` method
        // https://tc39.es/ecma262/#sec-string.prototype.match
        function match(regexp) {
          var O = requireObjectCoercible(this);
          var matcher = isNullOrUndefined(regexp) ? undefined : getMethod(regexp, MATCH);
          return matcher ? call(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString$1(O));
        },
        // `RegExp.prototype[@@match]` method
        // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
        function (string) {
          var rx = anObject(this);
          var S = toString$1(string);
          var res = maybeCallNative(nativeMatch, rx, S);

          if (res.done) return res.value;

          if (!rx.global) return regExpExec(rx, S);

          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
          var A = [];
          var n = 0;
          var result;
          while ((result = regExpExec(rx, S)) !== null) {
            var matchStr = toString$1(result[0]);
            A[n] = matchStr;
            if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
            n++;
          }
          return n === 0 ? null : A;
        }
      ];
    });

    var prefix = "$";

    function Map$1() {}

    Map$1.prototype = map.prototype = {
      constructor: Map$1,
      has: function(key) {
        return (prefix + key) in this;
      },
      get: function(key) {
        return this[prefix + key];
      },
      set: function(key, value) {
        this[prefix + key] = value;
        return this;
      },
      remove: function(key) {
        var property = prefix + key;
        return property in this && delete this[property];
      },
      clear: function() {
        for (var property in this) if (property[0] === prefix) delete this[property];
      },
      keys: function() {
        var keys = [];
        for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
        return keys;
      },
      values: function() {
        var values = [];
        for (var property in this) if (property[0] === prefix) values.push(this[property]);
        return values;
      },
      entries: function() {
        var entries = [];
        for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
        return entries;
      },
      size: function() {
        var size = 0;
        for (var property in this) if (property[0] === prefix) ++size;
        return size;
      },
      empty: function() {
        for (var property in this) if (property[0] === prefix) return false;
        return true;
      },
      each: function(f) {
        for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
      }
    };

    function map(object, f) {
      var map = new Map$1;

      // Copy constructor.
      if (object instanceof Map$1) object.each(function(value, key) { map.set(key, value); });

      // Index array by numeric index or specified key function.
      else if (Array.isArray(object)) {
        var i = -1,
            n = object.length,
            o;

        if (f == null) while (++i < n) map.set(i, object[i]);
        else while (++i < n) map.set(f(o = object[i], i, object), o);
      }

      // Convert object to map.
      else if (object) for (var key in object) map.set(key, object[key]);

      return map;
    }

    function Set$1() {}

    var proto = map.prototype;

    Set$1.prototype = {
      constructor: Set$1,
      has: proto.has,
      add: function(value) {
        value += "";
        this[prefix + value] = value;
        return this;
      },
      remove: proto.remove,
      clear: proto.clear,
      values: proto.keys,
      size: proto.size,
      empty: proto.empty,
      each: proto.each
    };

    var noop = {value: function() {}};

    function dispatch() {
      for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
        if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
      }
      return new Dispatch(_);
    }

    function Dispatch(_) {
      this._ = _;
    }

    function parseTypenames(typenames, types) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {type: t, name: name};
      });
    }

    Dispatch.prototype = dispatch.prototype = {
      constructor: Dispatch,
      on: function(typename, callback) {
        var _ = this._,
            T = parseTypenames(typename + "", _),
            t,
            i = -1,
            n = T.length;

        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
          while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
          return;
        }

        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while (++i < n) {
          if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
          else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
        }

        return this;
      },
      copy: function() {
        var copy = {}, _ = this._;
        for (var t in _) copy[t] = _[t].slice();
        return new Dispatch(copy);
      },
      call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      },
      apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      }
    };

    function get(type, name) {
      for (var i = 0, n = type.length, c; i < n; ++i) {
        if ((c = type[i]).name === name) {
          return c.value;
        }
      }
    }

    function set(type, name, callback) {
      for (var i = 0, n = type.length; i < n; ++i) {
        if (type[i].name === name) {
          type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
          break;
        }
      }
      if (callback != null) type.push({name: name, value: callback});
      return type;
    }

    function request(url, callback) {
      var request,
          event = dispatch("beforesend", "progress", "load", "error"),
          mimeType,
          headers = map(),
          xhr = new XMLHttpRequest,
          user = null,
          password = null,
          response,
          responseType,
          timeout = 0;

      // If IE does not support CORS, use XDomainRequest.
      if (typeof XDomainRequest !== "undefined"
          && !("withCredentials" in xhr)
          && /^(http(s)?:)?\/\//.test(url)) xhr = new XDomainRequest;

      "onload" in xhr
          ? xhr.onload = xhr.onerror = xhr.ontimeout = respond
          : xhr.onreadystatechange = function(o) { xhr.readyState > 3 && respond(o); };

      function respond(o) {
        var status = xhr.status, result;
        if (!status && hasResponse(xhr)
            || status >= 200 && status < 300
            || status === 304) {
          if (response) {
            try {
              result = response.call(request, xhr);
            } catch (e) {
              event.call("error", request, e);
              return;
            }
          } else {
            result = xhr;
          }
          event.call("load", request, result);
        } else {
          event.call("error", request, o);
        }
      }

      xhr.onprogress = function(e) {
        event.call("progress", request, e);
      };

      request = {
        header: function(name, value) {
          name = (name + "").toLowerCase();
          if (arguments.length < 2) return headers.get(name);
          if (value == null) headers.remove(name);
          else headers.set(name, value + "");
          return request;
        },

        // If mimeType is non-null and no Accept header is set, a default is used.
        mimeType: function(value) {
          if (!arguments.length) return mimeType;
          mimeType = value == null ? null : value + "";
          return request;
        },

        // Specifies what type the response value should take;
        // for instance, arraybuffer, blob, document, or text.
        responseType: function(value) {
          if (!arguments.length) return responseType;
          responseType = value;
          return request;
        },

        timeout: function(value) {
          if (!arguments.length) return timeout;
          timeout = +value;
          return request;
        },

        user: function(value) {
          return arguments.length < 1 ? user : (user = value == null ? null : value + "", request);
        },

        password: function(value) {
          return arguments.length < 1 ? password : (password = value == null ? null : value + "", request);
        },

        // Specify how to convert the response content to a specific type;
        // changes the callback value on "load" events.
        response: function(value) {
          response = value;
          return request;
        },

        // Alias for send("GET", …).
        get: function(data, callback) {
          return request.send("GET", data, callback);
        },

        // Alias for send("POST", …).
        post: function(data, callback) {
          return request.send("POST", data, callback);
        },

        // If callback is non-null, it will be used for error and load events.
        send: function(method, data, callback) {
          xhr.open(method, url, true, user, password);
          if (mimeType != null && !headers.has("accept")) headers.set("accept", mimeType + ",*/*");
          if (xhr.setRequestHeader) headers.each(function(value, name) { xhr.setRequestHeader(name, value); });
          if (mimeType != null && xhr.overrideMimeType) xhr.overrideMimeType(mimeType);
          if (responseType != null) xhr.responseType = responseType;
          if (timeout > 0) xhr.timeout = timeout;
          if (callback == null && typeof data === "function") callback = data, data = null;
          if (callback != null && callback.length === 1) callback = fixCallback(callback);
          if (callback != null) request.on("error", callback).on("load", function(xhr) { callback(null, xhr); });
          event.call("beforesend", request, xhr);
          xhr.send(data == null ? null : data);
          return request;
        },

        abort: function() {
          xhr.abort();
          return request;
        },

        on: function() {
          var value = event.on.apply(event, arguments);
          return value === event ? request : value;
        }
      };

      if (callback != null) {
        if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
        return request.get(callback);
      }

      return request;
    }

    function fixCallback(callback) {
      return function(error, xhr) {
        callback(error == null ? xhr : null);
      };
    }

    function hasResponse(xhr) {
      var type = xhr.responseType;
      return type && type !== "text"
          ? xhr.response // null on error
          : xhr.responseText; // "" on error
    }

    function type(defaultMimeType, response) {
      return function(url, callback) {
        var r = request(url).mimeType(defaultMimeType).response(response);
        if (callback != null) {
          if (typeof callback !== "function") throw new Error("invalid callback: " + callback);
          return r.get(callback);
        }
        return r;
      };
    }

    var html = type("text/html", function(xhr) {
      return document.createRange().createContextualFragment(xhr.responseText);
    });

    var json = type("application/json", function(xhr) {
      return JSON.parse(xhr.responseText);
    });

    var text = type("text/plain", function(xhr) {
      return xhr.responseText;
    });

    var xml = type("application/xml", function(xhr) {
      var xml = xhr.responseXML;
      if (!xml) throw new Error("parse error");
      return xml;
    });

    var EOL = {},
        EOF = {},
        QUOTE = 34,
        NEWLINE = 10,
        RETURN = 13;

    function objectConverter(columns) {
      return new Function("d", "return {" + columns.map(function(name, i) {
        return JSON.stringify(name) + ": d[" + i + "]";
      }).join(",") + "}");
    }

    function customConverter(columns, f) {
      var object = objectConverter(columns);
      return function(row, i) {
        return f(object(row), i, columns);
      };
    }

    // Compute unique columns in order of discovery.
    function inferColumns(rows) {
      var columnSet = Object.create(null),
          columns = [];

      rows.forEach(function(row) {
        for (var column in row) {
          if (!(column in columnSet)) {
            columns.push(columnSet[column] = column);
          }
        }
      });

      return columns;
    }

    function dsv$1(delimiter) {
      var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
          DELIMITER = delimiter.charCodeAt(0);

      function parse(text, f) {
        var convert, columns, rows = parseRows(text, function(row, i) {
          if (convert) return convert(row, i - 1);
          columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
        });
        rows.columns = columns || [];
        return rows;
      }

      function parseRows(text, f) {
        var rows = [], // output rows
            N = text.length,
            I = 0, // current character index
            n = 0, // current line number
            t, // current token
            eof = N <= 0, // current token followed by EOF?
            eol = false; // current token followed by EOL?

        // Strip the trailing newline.
        if (text.charCodeAt(N - 1) === NEWLINE) --N;
        if (text.charCodeAt(N - 1) === RETURN) --N;

        function token() {
          if (eof) return EOF;
          if (eol) return eol = false, EOL;

          // Unescape quotes.
          var i, j = I, c;
          if (text.charCodeAt(j) === QUOTE) {
            while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
            if ((i = I) >= N) eof = true;
            else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            return text.slice(j + 1, i - 1).replace(/""/g, "\"");
          }

          // Find next delimiter or newline.
          while (I < N) {
            if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            else if (c !== DELIMITER) continue;
            return text.slice(j, i);
          }

          // Return last token before EOF.
          return eof = true, text.slice(j, N);
        }

        while ((t = token()) !== EOF) {
          var row = [];
          while (t !== EOL && t !== EOF) row.push(t), t = token();
          if (f && (row = f(row, n++)) == null) continue;
          rows.push(row);
        }

        return rows;
      }

      function format(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return [columns.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
          return columns.map(function(column) {
            return formatValue(row[column]);
          }).join(delimiter);
        })).join("\n");
      }

      function formatRows(rows) {
        return rows.map(formatRow).join("\n");
      }

      function formatRow(row) {
        return row.map(formatValue).join(delimiter);
      }

      function formatValue(text) {
        return text == null ? ""
            : reFormat.test(text += "") ? "\"" + text.replace(/"/g, "\"\"") + "\""
            : text;
      }

      return {
        parse: parse,
        parseRows: parseRows,
        format: format,
        formatRows: formatRows
      };
    }

    var csv$1 = dsv$1(",");

    var csvParse = csv$1.parse;
    var csvParseRows = csv$1.parseRows;
    var csvFormat = csv$1.format;
    var csvFormatRows = csv$1.formatRows;

    var tsv$1 = dsv$1("\t");

    var tsvParse = tsv$1.parse;
    var tsvParseRows = tsv$1.parseRows;
    var tsvFormat = tsv$1.format;
    var tsvFormatRows = tsv$1.formatRows;

    var src = /*#__PURE__*/Object.freeze({
        __proto__: null,
        dsvFormat: dsv$1,
        csvParse: csvParse,
        csvParseRows: csvParseRows,
        csvFormat: csvFormat,
        csvFormatRows: csvFormatRows,
        tsvParse: tsvParse,
        tsvParseRows: tsvParseRows,
        tsvFormat: tsvFormat,
        tsvFormatRows: tsvFormatRows
    });

    function dsv(defaultMimeType, parse) {
      return function(url, row, callback) {
        if (arguments.length < 3) callback = row, row = null;
        var r = request(url).mimeType(defaultMimeType);
        r.row = function(_) { return arguments.length ? r.response(responseOf(parse, row = _)) : row; };
        r.row(row);
        return callback ? r.get(callback) : r;
      };
    }

    function responseOf(parse, row) {
      return function(request) {
        return parse(request.responseText, row);
      };
    }

    var csv = dsv("text/csv", csvParse);

    var tsv = dsv("text/tab-separated-values", tsvParse);

    var d3Request = /*#__PURE__*/Object.freeze({
        __proto__: null,
        request: request,
        html: html,
        json: json,
        text: text,
        xml: xml,
        csv: csv,
        tsv: tsv
    });

    var require$$8 = /*@__PURE__*/getAugmentedNamespace(d3Request);

    var require$$9 = /*@__PURE__*/getAugmentedNamespace(src);

    var _nodeResolve_empty = {};

    var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': _nodeResolve_empty
    });

    var require$$12 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

    Object.defineProperty(io$1, "__esModule", {
      value: true
    });
    io$1.toDSV = toDSV;
    io$1.toCSV = toCSV;
    io$1.toTSV = toTSV;
    io$1.toPSV = toPSV;
    io$1.toText = toText;
    io$1.toJSON = toJSON;
    io$1.fromDSV = fromDSV;
    io$1.fromCSV = fromCSV;
    io$1.fromTSV = fromTSV;
    io$1.fromPSV = fromPSV;
    io$1.fromText = fromText;
    io$1.fromJSON = fromJSON;

    var _d3Request = require$$8;

    var _d3Dsv = require$$9;

    var _symbol$1 = symbol;

    var _errors$4 = errors;

    var FILE_PATTERN = /^(?:[/]|[./]|(?:[a-zA-z]:\/)).*$/;

    function saveFile(path, content) {
      try {
        require$$12.writeFileSync(path, content);
      } catch (e) {
        console.warn("File system module is not available.");
      }
    }

    function loadTextFile(file, func) {
      if (FileReader && File) {
        var reader = new FileReader();

        reader.onload = function (event) {
          return func(event.target.result);
        };

        reader.readAsText(file);
      }
    }

    function addFileProtocol(path) {
      var isValidFilePath = String(path).match(FILE_PATTERN);

      if (isValidFilePath) {
        return "file://".concat(path);
      }

      return path;
    }

    function toDSV(df) {
      var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ";";
      var header = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
      var parser = (0, _d3Dsv.dsvFormat)(sep);
      var csvContent = header ? parser.format(df.toCollection(), df[_symbol$1.__columns__]) : parser.formatRows(df.toArray());

      if (path) {
        saveFile(df._cleanSavePath(path), csvContent);
      }

      return csvContent;
    }

    function toText(df) {
      var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ";";
      var header = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
      return df.toDSV(sep, header, path);
    }

    function toCSV(df) {
      var header = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      return df.toDSV(",", header, path);
    }

    function toTSV(df) {
      var header = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      return df.toDSV("\t", header, path);
    }

    function toPSV(df) {
      var header = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      return df.toDSV("|", header, path);
    }

    function toJSON(df) {
      var asCollection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var jsonContent = JSON.stringify(asCollection ? df.toCollection() : df.toDict());

      if (path) {
        saveFile(df._cleanSavePath(path), jsonContent);
      }

      return jsonContent;
    }

    function fromDSV(pathOrFile) {
      var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ";";
      var header = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var parser = (0, _d3Dsv.dsvFormat)(sep);
      return new Promise(function (resolve) {
        var parseText = function parseText(fileContent) {
          if (fileContent.includes("Error: ENOENT")) return resolve(null);
          var data = header ? parser.parse(fileContent) : parser.parseRows(fileContent);
          return resolve(data);
        };

        return typeof pathOrFile === "string" ? (0, _d3Request.text)(addFileProtocol(pathOrFile), parseText) : loadTextFile(pathOrFile, parseText);
      }).then(function (fileContent) {
        if (fileContent === null) {
          throw new _errors$4.FileNotFoundError(pathOrFile);
        }

        return fileContent;
      });
    }

    function fromText(pathOrFile) {
      var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ";";
      var header = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      return fromDSV(pathOrFile, sep, header);
    }

    function fromCSV(pathOrFile) {
      var header = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return fromDSV(pathOrFile, ",", header);
    }

    function fromTSV(pathOrFile) {
      var header = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return fromDSV(pathOrFile, "\t", header);
    }

    function fromPSV(pathOrFile) {
      var header = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return fromDSV(pathOrFile, "|", header);
    }

    function fromJSON(pathOrFile) {
      return new Promise(function (resolve) {
        return typeof pathOrFile === "string" ? (0, _d3Request.json)(addFileProtocol(pathOrFile), resolve) : loadTextFile(pathOrFile, function (txt) {
          return resolve(JSON.parse(txt));
        });
      }).then(function (fileContent) {
        if (fileContent === null) {
          throw new _errors$4.FileNotFoundError(pathOrFile);
        }

        return fileContent;
      });
    }

    Object.defineProperty(dataframe, "__esModule", {
      value: true
    });
    dataframe.default = void 0;



    var _reusables$3 = reusables;

    var _errors$3 = errors;

    var _row = _interopRequireDefault$2(row);

    var _group = group;

    var _symbol = symbol;

    var io = _interopRequireWildcard(io$1);

    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

    function _interopRequireDefault$2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    function _toConsumableArray$2(arr) { return _arrayWithoutHoles$2(arr) || _iterableToArray$2(arr) || _nonIterableSpread$2(); }

    function _nonIterableSpread$2() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

    function _iterableToArray$2(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

    function _arrayWithoutHoles$2(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

    function _slicedToArray$1(arr, i) { return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _nonIterableRest$1(); }

    function _nonIterableRest$1() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

    function _iterableToArrayLimit$1(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

    function _arrayWithHoles$1(arr) { if (Array.isArray(arr)) return arr; }

    function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties$3(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass$3(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$3(Constructor.prototype, protoProps); if (staticProps) _defineProperties$3(Constructor, staticProps); return Constructor; }

    var DataFrame$1 = function () {
      _createClass$3(DataFrame, null, [{
        key: "setDefaultModules",
        value: function setDefaultModules() {
          for (var _len = arguments.length, defaultModules = new Array(_len), _key = 0; _key < _len; _key++) {
            defaultModules[_key] = arguments[_key];
          }

          DataFrame.defaultModules = defaultModules;
        }
      }, {
        key: "fromDSV",
        value: function fromDSV() {
          return io.fromDSV.apply(io, arguments).then(function (content) {
            return new DataFrame(content);
          });
        }
      }, {
        key: "fromText",
        value: function fromText() {
          return io.fromText.apply(io, arguments).then(function (content) {
            return new DataFrame(content);
          });
        }
      }, {
        key: "fromCSV",
        value: function fromCSV() {
          return io.fromCSV.apply(io, arguments).then(function (content) {
            return new DataFrame(content);
          });
        }
      }, {
        key: "fromTSV",
        value: function fromTSV() {
          return io.fromTSV.apply(io, arguments).then(function (content) {
            return new DataFrame(content);
          });
        }
      }, {
        key: "fromPSV",
        value: function fromPSV() {
          return io.fromPSV.apply(io, arguments).then(function (content) {
            return new DataFrame(content);
          });
        }
      }, {
        key: "fromJSON",
        value: function fromJSON() {
          return io.fromJSON.apply(io, arguments).then(function (content) {
            return new DataFrame(content);
          });
        }
      }]);

      function DataFrame(data, columns) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck$3(this, DataFrame);

        var _this$_build = this._build(data, columns);

        var _this$_build2 = _slicedToArray$1(_this$_build, 2);

        this[_symbol.__rows__] = _this$_build2[0];
        this[_symbol.__columns__] = _this$_build2[1];
        this.options = options;
        this.options.modules = [].concat(_toConsumableArray$2(DataFrame.defaultModules), _toConsumableArray$2(this.options.modules || []));
        Object.assign.apply(Object, [this].concat(_toConsumableArray$2(this.__instanciateModules__(this.options.modules))));
      }

      _createClass$3(DataFrame, [{
        key: Symbol.iterator,
        value: regeneratorRuntime.mark(function value() {
          var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, row;

          return regeneratorRuntime.wrap(function value$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context.prev = 3;
                  _iterator = this[_symbol.__rows__][Symbol.iterator]();

                case 5:
                  if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _context.next = 12;
                    break;
                  }

                  row = _step.value;
                  _context.next = 9;
                  return row;

                case 9:
                  _iteratorNormalCompletion = true;
                  _context.next = 5;
                  break;

                case 12:
                  _context.next = 18;
                  break;

                case 14:
                  _context.prev = 14;
                  _context.t0 = _context["catch"](3);
                  _didIteratorError = true;
                  _iteratorError = _context.t0;

                case 18:
                  _context.prev = 18;
                  _context.prev = 19;

                  if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                  }

                case 21:
                  _context.prev = 21;

                  if (!_didIteratorError) {
                    _context.next = 24;
                    break;
                  }

                  throw _iteratorError;

                case 24:
                  return _context.finish(21);

                case 25:
                  return _context.finish(18);

                case 26:
                case "end":
                  return _context.stop();
              }
            }
          }, value, this, [[3, 14, 18, 26], [19,, 21, 25]]);
        })
      }, {
        key: "_columnsAreEquals",
        value: function _columnsAreEquals(columns) {
          var columns2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this[_symbol.__columns__];

          for (var _i2 = 0, _Object$keys = Object.keys(columns); _i2 < _Object$keys.length; _i2++) {
            var key = _Object$keys[_i2];
            if (columns[key] !== columns2[key]) return false;
          }

          return true;
        }
      }, {
        key: "__newInstance__",
        value: function __newInstance__(data, columns) {
          if (!this._columnsAreEquals(columns) || !(data[0] instanceof _row.default)) {
            return new DataFrame(data, columns, this.options);
          }

          var firstRowColumns = Object.keys(data[0].toDict());

          if (!(0, _reusables$3.arrayEqual)(firstRowColumns, this[_symbol.__columns__], true)) {
            return new DataFrame(data, firstRowColumns, this.options);
          }

          var newInstance = new DataFrame([], [], this.options);
          newInstance[_symbol.__rows__] = _toConsumableArray$2(data);
          newInstance[_symbol.__columns__] = _toConsumableArray$2(columns);
          return newInstance;
        }
      }, {
        key: "__instanciateModules__",
        value: function __instanciateModules__(modules) {
          var _this = this;

          var df = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
          return modules.map(function (Plugin) {
            var pluginInstance = new Plugin(df ? df : _this);
            return _defineProperty({}, pluginInstance.name, pluginInstance);
          });
        }
      }, {
        key: "_build",
        value: function _build(data, columns) {
          if (data instanceof DataFrame) {
            return this._fromArray(Array.from(data[_symbol.__rows__]), columns || data[_symbol.__columns__]);
          }

          if (data instanceof Array && data.length > 0) {
            return this._fromArray(data, columns || Array.from(new Set(data.slice(0, 10).concat(data.slice(-10, -1)).map(function (row) {
              return Object.keys(row);
            }).reduce(function (p, n) {
              return p.concat(n);
            }))));
          }

          if (data instanceof Array && data.length === 0) {
            return this._fromArray(data, columns ? columns : []);
          }

          if (data instanceof Object) {
            return this._fromDict(data, columns || Object.keys(data));
          }

          throw new _errors$3.ArgumentTypeError(data, "DataFrame | Array | Object");
        }
      }, {
        key: "_fromDict",
        value: function _fromDict(dict, columns) {
          return [(0, _reusables$3.transpose)(Object.values(dict)).map(function (row) {
            return new _row.default(row, columns);
          }), columns];
        }
      }, {
        key: "_fromArray",
        value: function _fromArray(array, columns) {
          return [array.map(function (row) {
            return new _row.default(row, columns);
          }), columns];
        }
      }, {
        key: "_joinByType",
        value: function _joinByType(gdf1, gdf2, type, newColumns) {
          var _this2 = this;

          var gdf2Hashs = gdf2.listHashs();
          return gdf1.toCollection().map(function (_ref2) {
            var group = _ref2.group,
                hash = _ref2.hash;
            var isContained = gdf2Hashs.includes(hash);
            var modifiedGroup = group;

            if (gdf2.get(hash)) {
              var gdf2Collection = gdf2.get(hash).group.toCollection();
              var combinedGroup = group.toCollection().map(function (row) {
                return gdf2Collection.map(function (row2) {
                  return Object.assign({}, row2, row);
                });
              }).reduce(function (p, n) {
                return [].concat(_toConsumableArray$2(p), _toConsumableArray$2(n));
              }, []);
              modifiedGroup = _this2.__newInstance__(combinedGroup, newColumns);
            }

            var filterCondition = function filterCondition(bool) {
              return bool ? modifiedGroup : false;
            };

            if (type === "full") return modifiedGroup;
            return type === "out" ? filterCondition(!isContained) : filterCondition(isContained);
          }).filter(function (group) {
            return group;
          });
        }
      }, {
        key: "_join",
        value: function _join(dfToJoin, columnNames, types) {
          if (!(dfToJoin instanceof DataFrame)) throw new _errors$3.ArgumentTypeError(dfToJoin, "DataFrame");

          var newColumns = _toConsumableArray$2(new Set([].concat(_toConsumableArray$2(this.listColumns()), _toConsumableArray$2(dfToJoin.listColumns()))));

          var columns = Array.isArray(columnNames) ? columnNames : [columnNames];
          var gdf = this.groupBy.apply(this, _toConsumableArray$2(columns));
          var gdfToJoin = dfToJoin.groupBy.apply(dfToJoin, _toConsumableArray$2(columns));
          return [this.__newInstance__([], newColumns)].concat(_toConsumableArray$2((0, _reusables$3.iter)([].concat(_toConsumableArray$2(types[0] ? this._joinByType(gdf, gdfToJoin, types[0], newColumns) : []), _toConsumableArray$2(types[1] ? this._joinByType(gdfToJoin, gdf, types[1], newColumns) : [])), function (group) {
            return group.restructure(newColumns);
          }))).reduce(function (p, n) {
            return p.union(n);
          }).dropDuplicates();
        }
      }, {
        key: "_cleanSavePath",
        value: function _cleanSavePath(path) {
          return path.replace("file://", "/");
        }
      }, {
        key: "toDSV",
        value: function toDSV() {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return io.toDSV.apply(io, [this].concat(args));
        }
      }, {
        key: "toCSV",
        value: function toCSV() {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return io.toCSV.apply(io, [this].concat(args));
        }
      }, {
        key: "toTSV",
        value: function toTSV() {
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return io.toTSV.apply(io, [this].concat(args));
        }
      }, {
        key: "toPSV",
        value: function toPSV() {
          for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
          }

          return io.toPSV.apply(io, [this].concat(args));
        }
      }, {
        key: "toText",
        value: function toText() {
          for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
          }

          return io.toText.apply(io, [this].concat(args));
        }
      }, {
        key: "toJSON",
        value: function toJSON() {
          for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
          }

          return io.toJSON.apply(io, [this].concat(args));
        }
      }, {
        key: "toDict",
        value: function toDict() {
          var _this3 = this;

          return Object.assign.apply(Object, [{}].concat(_toConsumableArray$2(Object.entries(this.transpose().toArray()).map(function (_ref3) {
            var _ref4 = _slicedToArray$1(_ref3, 2),
                index = _ref4[0],
                column = _ref4[1];

            return _defineProperty({}, _this3[_symbol.__columns__][index], column);
          }))));
        }
      }, {
        key: "toArray",
        value: function toArray(columnName) {
          return columnName ? Array.from(this).map(function (row) {
            return row.get(columnName);
          }) : Array.from(this).map(function (row) {
            return row.toArray();
          });
        }
      }, {
        key: "toCollection",
        value: function toCollection(ofRows) {
          return ofRows ? Array.from(this) : Array.from(this).map(function (row) {
            return row.toDict();
          });
        }
      }, {
        key: "show",
        value: function show() {
          var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
          var quiet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

          var makeRow = function makeRow(row) {
            return "| ".concat(row.map(function (column) {
              var columnAsString = String(column);
              return columnAsString.length > 9 ? columnAsString.substring(0, 6) + "..." : columnAsString + Array(10 - columnAsString.length).join(" ");
            }).join(" | "), " |");
          };

          var header = makeRow(this[_symbol.__columns__]);
          var token = 0;
          var toShow = [header, Array(header.length).join("-")].concat(_toConsumableArray$2((0, _reusables$3.iter)(this[_symbol.__rows__], function (row) {
            token++;
            return makeRow(row.toArray());
          }, function () {
            return token >= rows;
          }))).join("\n");

          if (!quiet) {
            console.log(toShow);
          }

          return toShow;
        }
      }, {
        key: "dim",
        value: function dim() {
          return [this.count(), this[_symbol.__columns__].length];
        }
      }, {
        key: "transpose",
        value: function transpose(tranposeColumnNames) {
          var newColumns = [].concat(_toConsumableArray$2(tranposeColumnNames ? ["rowNames"] : []), _toConsumableArray$2(_toConsumableArray$2(Array(this.count()).keys()).reverse()));
          var transposedRows = (0, _reusables$3.transpose)((tranposeColumnNames ? this.push(this[_symbol.__columns__]) : this).toArray());
          return this.__newInstance__(transposedRows, newColumns.reverse()).restructure(newColumns);
        }
      }, {
        key: "count",
        value: function count() {
          return this[_symbol.__rows__].length;
        }
      }, {
        key: "countValue",
        value: function countValue(valueToCount) {
          var columnName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this[_symbol.__columns__][0];
          return this.filter(function (row) {
            return row.get(columnName) === valueToCount;
          }).count();
        }
      }, {
        key: "push",
        value: function push() {
          for (var _len8 = arguments.length, rows = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            rows[_key8] = arguments[_key8];
          }

          return this.union(new DataFrame(rows, this[_symbol.__columns__]));
        }
      }, {
        key: "replace",
        value: function replace(value, replacement, columnNames) {
          var _this4 = this;

          var columns = columnNames && columnNames.length > 0 ? columnNames : this[_symbol.__columns__];
          var values = Array.isArray(value) ? value : [value];
          return this.map(function (row) {
            return (columns.length > 0 ? columns : _this4[_symbol.__columns__]).reduce(function (p, n) {
              return values.includes(p.get(n)) ? p.set(n, replacement) : p;
            }, row);
          });
        }
      }, {
        key: "distinct",
        value: function distinct(columnName) {
          return this.__newInstance__(_defineProperty({}, columnName, _toConsumableArray$2(new Set(this.toArray(columnName)))), [columnName]);
        }
      }, {
        key: "unique",
        value: function unique(columnName) {
          return this.distinct(columnName);
        }
      }, {
        key: "listColumns",
        value: function listColumns() {
          return _toConsumableArray$2(this[_symbol.__columns__]);
        }
      }, {
        key: "select",
        value: function select() {
          for (var _len9 = arguments.length, columnNames = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
            columnNames[_key9] = arguments[_key9];
          }

          return this.__newInstance__(this[_symbol.__rows__].map(function (row) {
            return row.select.apply(row, columnNames);
          }), columnNames);
        }
      }, {
        key: "withColumn",
        value: function withColumn(columnName) {
          var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
            return undefined;
          };
          return this.__newInstance__(this[_symbol.__rows__].map(function (row, index) {
            return row.set(columnName, func(row, index));
          }), this[_symbol.__columns__].includes(columnName) ? this[_symbol.__columns__] : [].concat(_toConsumableArray$2(this[_symbol.__columns__]), [columnName]));
        }
      }, {
        key: "restructure",
        value: function restructure(newColumnNames) {
          return this.__newInstance__(this[_symbol.__rows__], newColumnNames);
        }
      }, {
        key: "renameAll",
        value: function renameAll(newColumnNames) {
          if (newColumnNames.length !== this[_symbol.__columns__].length) {
            throw new _errors$3.WrongSchemaError(newColumnNames, this[_symbol.__columns__]);
          }

          return this.__newInstance__(this.toArray(), newColumnNames);
        }
      }, {
        key: "rename",
        value: function rename(columnName, replacement) {
          var newColumnNames = this[_symbol.__columns__].map(function (column) {
            return column === columnName ? replacement : column;
          });

          return this.renameAll(newColumnNames);
        }
      }, {
        key: "castAll",
        value: function castAll(typeFunctions) {
          var _this5 = this;

          if (typeFunctions.length !== this[_symbol.__columns__].length) {
            throw new _errors$3.WrongSchemaError(typeFunctions, this[_symbol.__columns__]);
          }

          return this.map(function (row) {
            return new _row.default(row.toArray().map(function (column, index) {
              return typeFunctions[index](column);
            }), _this5[_symbol.__columns__]);
          });
        }
      }, {
        key: "cast",
        value: function cast(columnName, typeFunction) {
          return this.withColumn(columnName, function (row) {
            return typeFunction(row.get(columnName));
          });
        }
      }, {
        key: "drop",
        value: function drop(columnName) {
          return this.__newInstance__(this[_symbol.__rows__].map(function (row) {
            return row.delete(columnName);
          }), this[_symbol.__columns__].filter(function (column) {
            return column !== columnName;
          }));
        }
      }, {
        key: "chain",
        value: function chain() {
          for (var _len10 = arguments.length, funcs = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
            funcs[_key10] = arguments[_key10];
          }

          return this.__newInstance__(_toConsumableArray$2(_reusables$3.chain.apply(void 0, [this[_symbol.__rows__]].concat(funcs))), this[_symbol.__columns__]);
        }
      }, {
        key: "filter",
        value: function filter(condition) {
          var func = _typeof(condition) === "object" ? function (row) {
            return Object.entries(condition).map(function (_ref6) {
              var _ref7 = _slicedToArray$1(_ref6, 2),
                  column = _ref7[0],
                  value = _ref7[1];

              return Object.is(row.get(column), value);
            }).reduce(function (p, n) {
              return p && n;
            });
          } : condition;
          var filteredRows = (0, _reusables$3.iter)(this[_symbol.__rows__], function (row, i) {
            return func(row, i) ? row : false;
          });
          return this.__newInstance__(filteredRows, this[_symbol.__columns__]);
        }
      }, {
        key: "where",
        value: function where(condition) {
          return this.filter(condition);
        }
      }, {
        key: "find",
        value: function find(condition) {
          return this.filter(condition)[_symbol.__rows__][0];
        }
      }, {
        key: "map",
        value: function map(func) {
          return this.__newInstance__((0, _reusables$3.iter)(this[_symbol.__rows__], function (row, i) {
            return func(row, i);
          }), this[_symbol.__columns__]);
        }
      }, {
        key: "reduce",
        value: function reduce(func, init) {
          return typeof init === "undefined" ? this[_symbol.__rows__].reduce(function (p, n) {
            return func(p, n);
          }) : this[_symbol.__rows__].reduce(function (p, n) {
            return func(p, n);
          }, init);
        }
      }, {
        key: "reduceRight",
        value: function reduceRight(func, init) {
          return typeof init === "undefined" ? this[_symbol.__rows__].reduceRight(function (p, n) {
            return func(p, n);
          }) : this[_symbol.__rows__].reduceRight(function (p, n) {
            return func(p, n);
          }, init);
        }
      }, {
        key: "dropDuplicates",
        value: function dropDuplicates() {
          for (var _len11 = arguments.length, columnNames = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
            columnNames[_key11] = arguments[_key11];
          }

          var groupCols = columnNames && columnNames.length > 0 ? columnNames : this[_symbol.__columns__];
          return this.groupBy.apply(this, _toConsumableArray$2(groupCols)).filter(function (row, i) {
            return i === 0;
          });
        }
      }, {
        key: "dropMissingValues",
        value: function dropMissingValues(columnNames) {
          var cols = columnNames && columnNames.length > 0 ? columnNames : this[_symbol.__columns__];
          return this.filter(function (row) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = cols[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var col = _step2.value;

                if ([NaN, undefined, null].includes(row.get(col))) {
                  return false;
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            return true;
          });
        }
      }, {
        key: "fillMissingValues",
        value: function fillMissingValues(replacement, columnNames) {
          return this.replace([NaN, undefined, null], replacement, columnNames);
        }
      }, {
        key: "shuffle",
        value: function shuffle() {
          if (this.count() < 2) return this;
          return this.__newInstance__(this.reduce(function (p, n) {
            var index = Math.floor(Math.random() * (p.length - 1) + 1);
            return Array.isArray(p) ? [].concat(_toConsumableArray$2(p.slice(index, p.length + 1)), [n], _toConsumableArray$2(p.slice(0, index))) : [p, n];
          }), this[_symbol.__columns__]);
        }
      }, {
        key: "sample",
        value: function sample(percentage) {
          var nRows = this.count() * percentage;
          var token = 0;
          return this.__newInstance__((0, _reusables$3.iter)(this.shuffle()[_symbol.__rows__], function (row) {
            token++;
            return row;
          }, function () {
            return token >= nRows;
          }), this[_symbol.__columns__]);
        }
      }, {
        key: "bisect",
        value: function bisect(percentage) {
          var nRows = this.count() * percentage;
          var token = 0;
          var restRows = [];
          return [this.__newInstance__((0, _reusables$3.iter)(this.shuffle()[_symbol.__rows__], function (row) {
            if (token < nRows) {
              token++;
              return row;
            }

            restRows.push(row);
          }), this[_symbol.__columns__]), this.__newInstance__(restRows, this[_symbol.__columns__])];
        }
      }, {
        key: "groupBy",
        value: function groupBy() {
          for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
            args[_key12] = arguments[_key12];
          }

          return (0, _group.groupBy)(this, args);
        }
      }, {
        key: "sortBy",
        value: function sortBy(columnNames) {
          var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          var missingValuesPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "first";

          if (!Array.isArray(columnNames)) {
            columnNames = [columnNames];
          }

          var _columnNames = columnNames;

          var _missingValuesPosition = ["first", "last"].includes(missingValuesPosition) ? missingValuesPosition : "first";

          var _checkMissingValue = function _checkMissingValue(v) {
            return [NaN, null, undefined].includes(v);
          };

          var sortedRows = this[_symbol.__rows__].sort(function (p, n) {
            return _columnNames.map(function (col) {
              var _ref8 = [p.get(col), n.get(col)],
                  pValue = _ref8[0],
                  nValue = _ref8[1];

              if (_checkMissingValue(pValue)) {
                return _missingValuesPosition === "last" ? 1 : -1;
              } else if (_checkMissingValue(nValue)) {
                return _missingValuesPosition === "last" ? -1 : 1;
              } else if (_typeof(pValue) !== _typeof(nValue)) {
                throw new _errors$3.MixedTypeError([_typeof(pValue), _typeof(nValue)]);
              } else if (pValue > nValue) {
                return reverse ? -1 : 1;
              } else if (pValue < nValue) {
                return reverse ? 1 : -1;
              }

              return 0;
            }).reduce(function (acc, curr) {
              return acc || curr;
            });
          });

          if (_columnNames.length > 1) {
            var sortedRowsWithMissingValues = [];
            var sortedRowsWithoutMissingValues = [];
            sortedRows.forEach(function (row) {
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = _columnNames[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var col = _step3.value;

                  if (_checkMissingValue(row.get(col))) {
                    sortedRowsWithMissingValues.push(row);
                    return;
                  }
                }
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                    _iterator3.return();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }

              sortedRowsWithoutMissingValues.push(row);
            });
            return this.__newInstance__(missingValuesPosition === "last" ? sortedRowsWithoutMissingValues.concat(sortedRowsWithMissingValues) : sortedRowsWithMissingValues.concat(sortedRowsWithoutMissingValues), this[_symbol.__columns__]);
          }

          return this.__newInstance__(sortedRows, this[_symbol.__columns__]);
        }
      }, {
        key: "union",
        value: function union(dfToUnion) {
          if (!(dfToUnion instanceof DataFrame)) throw new _errors$3.ArgumentTypeError(dfToUnion, "DataFrame");

          if (!(0, _reusables$3.arrayEqual)(this[_symbol.__columns__], dfToUnion[_symbol.__columns__])) {
            throw new _errors$3.WrongSchemaError(dfToUnion[_symbol.__columns__], this[_symbol.__columns__]);
          }

          return this.__newInstance__([].concat(_toConsumableArray$2(this), _toConsumableArray$2(dfToUnion.restructure(this[_symbol.__columns__]))), this[_symbol.__columns__]);
        }
      }, {
        key: "join",
        value: function join(dfToJoin, columnNames) {
          var _this6 = this;

          var how = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "inner";
          var joinMethods = {
            inner: function inner() {
              return _this6.innerJoin(dfToJoin, columnNames);
            },
            full: function full() {
              return _this6.fullJoin(dfToJoin, columnNames);
            },
            outer: function outer() {
              return _this6.outerJoin(dfToJoin, columnNames);
            },
            left: function left() {
              return _this6.leftJoin(dfToJoin, columnNames);
            },
            right: function right() {
              return _this6.rightJoin(dfToJoin, columnNames);
            }
          };
          return joinMethods[how]();
        }
      }, {
        key: "innerJoin",
        value: function innerJoin(dfToJoin, columnNames) {
          return this._join(dfToJoin, columnNames, ["in"]);
        }
      }, {
        key: "fullJoin",
        value: function fullJoin(dfToJoin, columnNames) {
          return this._join(dfToJoin, columnNames, ["full", "full"]);
        }
      }, {
        key: "outerJoin",
        value: function outerJoin(dfToJoin, columnNames) {
          return this.fullJoin(dfToJoin, columnNames);
        }
      }, {
        key: "leftJoin",
        value: function leftJoin(dfToJoin, columnNames) {
          return this._join(dfToJoin, columnNames, ["full", "in"]);
        }
      }, {
        key: "rightJoin",
        value: function rightJoin(dfToJoin, columnNames) {
          return this._join(dfToJoin, columnNames, ["in", "full"]);
        }
      }, {
        key: "diff",
        value: function diff(dfToDiff, columnNames) {
          return this._join(dfToDiff, columnNames, ["out", "out"]);
        }
      }, {
        key: "head",
        value: function head() {
          var nRows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
          return this.slice(0, nRows);
        }
      }, {
        key: "tail",
        value: function tail() {
          var nRows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
          return this.slice(-nRows);
        }
      }, {
        key: "slice",
        value: function slice(startIndex, endIndex) {
          return this.__newInstance__(this[_symbol.__rows__].slice(startIndex || undefined, endIndex || undefined), this[_symbol.__columns__]);
        }
      }, {
        key: "getRow",
        value: function getRow(index) {
          return this[_symbol.__rows__][index];
        }
      }, {
        key: "setRow",
        value: function setRow(index) {
          var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (row) {
            return row;
          };
          var newRows = Array.from(this[_symbol.__rows__]);
          newRows[index] = func(newRows[index]);
          return this.__newInstance__(newRows, this[_symbol.__columns__]);
        }
      }]);

      return DataFrame;
    }();

    DataFrame$1.defaultModules = [];
    var _default$3 = DataFrame$1;
    dataframe.default = _default$3;

    var stat = {};

    var uncurryThis$2 = functionUncurryThis;

    // `thisNumberValue` abstract operation
    // https://tc39.es/ecma262/#sec-thisnumbervalue
    var thisNumberValue$1 = uncurryThis$2(1.0.valueOf);

    var DESCRIPTORS$1 = descriptors;
    var global$2 = global$u;
    var uncurryThis$1 = functionUncurryThis;
    var isForced$1 = isForced_1;
    var defineBuiltIn$1 = defineBuiltIn$f;
    var hasOwn$1 = hasOwnProperty_1;
    var inheritIfRequired$1 = inheritIfRequired$3;
    var isPrototypeOf$1 = objectIsPrototypeOf;
    var isSymbol = isSymbol$5;
    var toPrimitive = toPrimitive$3;
    var fails$2 = fails$G;
    var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    var defineProperty$1 = objectDefineProperty.f;
    var thisNumberValue = thisNumberValue$1;
    var trim = stringTrim.trim;

    var NUMBER = 'Number';
    var NativeNumber = global$2[NUMBER];
    var NumberPrototype = NativeNumber.prototype;
    var TypeError$1 = global$2.TypeError;
    var arraySlice = uncurryThis$1(''.slice);
    var charCodeAt = uncurryThis$1(''.charCodeAt);

    // `ToNumeric` abstract operation
    // https://tc39.es/ecma262/#sec-tonumeric
    var toNumeric = function (value) {
      var primValue = toPrimitive(value, 'number');
      return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
    };

    // `ToNumber` abstract operation
    // https://tc39.es/ecma262/#sec-tonumber
    var toNumber = function (argument) {
      var it = toPrimitive(argument, 'number');
      var first, third, radix, maxCode, digits, length, index, code;
      if (isSymbol(it)) throw TypeError$1('Cannot convert a Symbol value to a number');
      if (typeof it == 'string' && it.length > 2) {
        it = trim(it);
        first = charCodeAt(it, 0);
        if (first === 43 || first === 45) {
          third = charCodeAt(it, 2);
          if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
        } else if (first === 48) {
          switch (charCodeAt(it, 1)) {
            case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
            case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
            default: return +it;
          }
          digits = arraySlice(it, 2);
          length = digits.length;
          for (index = 0; index < length; index++) {
            code = charCodeAt(digits, index);
            // parseInt parses a string to a first unavailable symbol
            // but ToNumber should return NaN if a string contains unavailable symbols
            if (code < 48 || code > maxCode) return NaN;
          } return parseInt(digits, radix);
        }
      } return +it;
    };

    // `Number` constructor
    // https://tc39.es/ecma262/#sec-number-constructor
    if (isForced$1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
      var NumberWrapper = function Number(value) {
        var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
        var dummy = this;
        // check on 1..constructor(foo) case
        return isPrototypeOf$1(NumberPrototype, dummy) && fails$2(function () { thisNumberValue(dummy); })
          ? inheritIfRequired$1(Object(n), dummy, NumberWrapper) : n;
      };
      for (var keys$1 = DESCRIPTORS$1 ? getOwnPropertyNames$1(NativeNumber) : (
        // ES3:
        'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
        // ES2015 (in case, if modules with ES2015 Number statics required before):
        'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' +
        // ESNext
        'fromString,range'
      ).split(','), j = 0, key; keys$1.length > j; j++) {
        if (hasOwn$1(NativeNumber, key = keys$1[j]) && !hasOwn$1(NumberWrapper, key)) {
          defineProperty$1(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
        }
      }
      NumberWrapper.prototype = NumberPrototype;
      NumberPrototype.constructor = NumberWrapper;
      defineBuiltIn$1(global$2, NUMBER, NumberWrapper, { constructor: true });
    }

    var $$3 = _export;

    // `Number.isNaN` method
    // https://tc39.es/ecma262/#sec-number.isnan
    $$3({ target: 'Number', stat: true }, {
      isNaN: function isNaN(number) {
        // eslint-disable-next-line no-self-compare -- NaN check
        return number != number;
      }
    });

    Object.defineProperty(stat, "__esModule", {
      value: true
    });
    stat.default = void 0;

    var _reusables$2 = reusables;

    function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); if (staticProps) _defineProperties$2(Constructor, staticProps); return Constructor; }

    var Stat = function () {
      function Stat(df) {
        _classCallCheck$2(this, Stat);

        this.df = df;
        this.name = "stat";
      }

      _createClass$2(Stat, [{
        key: "_castAsNumber",
        value: function _castAsNumber(columnName) {
          return this.df.withColumn(columnName, function (row) {
            return Number(row.get(columnName));
          }).filter(function (row) {
            return !Number.isNaN(row.get(columnName));
          });
        }
      }, {
        key: "sum",
        value: function sum(columnName) {
          return Number(this.df.reduce(function (p, n) {
            return (0, _reusables$2.isNumber)(n.get(columnName)) ? p + Number(n.get(columnName)) : p;
          }, 0));
        }
      }, {
        key: "max",
        value: function max(columnName) {
          return this._castAsNumber(columnName).reduce(function (p, n) {
            return n.get(columnName) > p.get(columnName) ? n : p;
          }).get(columnName);
        }
      }, {
        key: "min",
        value: function min(columnName) {
          return this._castAsNumber(columnName).reduce(function (p, n) {
            return p.get(columnName) > n.get(columnName) ? n : p;
          }).get(columnName);
        }
      }, {
        key: "mean",
        value: function mean(columnName) {
          var numericDF = this.df.filter(function (row) {
            return (0, _reusables$2.isNumber)(row.get(columnName));
          });
          return Number(numericDF.reduce(function (p, n) {
            return (0, _reusables$2.isNumber)(n.get(columnName)) ? p + Number(n.get(columnName)) : p;
          }, 0)) / numericDF.count();
        }
      }, {
        key: "average",
        value: function average(columnName) {
          return this.mean(columnName);
        }
      }, {
        key: "var",
        value: function _var(columnName) {
          var population = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          var numericDF = this.df.filter(function (row) {
            return (0, _reusables$2.isNumber)(row.get(columnName));
          });
          var mean = this.mean(columnName);
          return Number(numericDF.reduce(function (p, n) {
            return p + Math.pow(n.get(columnName) - mean, 2);
          }, 0)) / (numericDF.count() - (population ? 0 : 1));
        }
      }, {
        key: "sd",
        value: function sd(columnName) {
          var population = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          return Math.sqrt(this.var(columnName, population));
        }
      }, {
        key: "stats",
        value: function stats(columnName) {
          return {
            sum: this.sum(columnName),
            mean: this.mean(columnName),
            min: this.min(columnName),
            max: this.max(columnName),
            var: this.var(columnName),
            varpop: this.var(columnName, true),
            sd: this.sd(columnName),
            sdpop: this.sd(columnName, true)
          };
        }
      }]);

      return Stat;
    }();

    var _default$2 = Stat;
    stat.default = _default$2;

    var matrix = {};

    Object.defineProperty(matrix, "__esModule", {
      value: true
    });
    matrix.default = void 0;

    var _dataframe$1 = _interopRequireDefault$1(dataframe);

    var _errors$2 = errors;

    var _reusables$1 = reusables;

    function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _toConsumableArray$1(arr) { return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _nonIterableSpread$1(); }

    function _nonIterableSpread$1() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

    function _iterableToArray$1(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

    function _arrayWithoutHoles$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

    function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

    var Matrix = function () {
      function Matrix(df) {
        _classCallCheck$1(this, Matrix);

        this.df = df;
        this.name = "matrix";
      }

      _createClass$1(Matrix, [{
        key: "isCommutative",
        value: function isCommutative(df) {
          var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          if (!(df instanceof _dataframe$1.default)) throw new _errors$2.ArgumentTypeError(df, "DataFrame");
          return (0, _reusables$1.arrayEqual)(this.df.dim(), reverse ? df.dim().reverse() : df.dim(), true);
        }
      }, {
        key: "add",
        value: function add(df) {
          var _this = this;

          if (!this.isCommutative(df)) {
            throw new _errors$2.WrongSchemaError(this.df.dim(), df.dim());
          }

          var columns = _toConsumableArray$1(Array(this.df.dim()[1]).keys());

          return this.df.__newInstance__(_toConsumableArray$1((0, _reusables$1.iter)(Object.keys(_toConsumableArray$1(this.df)), function (rowKey) {
            var a = _toConsumableArray$1(_this.df)[rowKey].toArray();

            var b = _toConsumableArray$1(df)[rowKey].toArray();

            return columns.map(function (column) {
              return a[column] + b[column];
            });
          })), this.df.listColumns());
        }
      }, {
        key: "product",
        value: function product(number) {
          if (!(typeof number === "number")) throw new _errors$2.ArgumentTypeError(number, "Number");
          return this.df.map(function (row) {
            return row.toArray().map(function (column) {
              return column * number;
            });
          });
        }
      }, {
        key: "dot",
        value: function dot(df) {
          var _this2 = this;

          if (!this.isCommutative(df, true)) {
            throw new _errors$2.WrongSchemaError(this.df.dim(), df.dim().reverse());
          }

          var columns = _toConsumableArray$1(Array(this.df.dim()[0]).keys());

          return this.df.__newInstance__(_toConsumableArray$1((0, _reusables$1.iter)(Object.keys(_toConsumableArray$1(this.df)), function (rowKey) {
            var a = _toConsumableArray$1(_this2.df)[rowKey].toArray();

            return _toConsumableArray$1((0, _reusables$1.iter)(columns, function (column) {
              var b = _toConsumableArray$1(df.transpose())[column].toArray();

              return Object.keys(b).reduce(function (p, n) {
                return p + b[n] * a[n];
              }, 0);
            }));
          })), columns);
        }
      }]);

      return Matrix;
    }();

    var _default$1 = Matrix;
    matrix.default = _default$1;

    var sql = {};

    var defineProperty = objectDefineProperty.f;

    var proxyAccessor$1 = function (Target, Source, key) {
      key in Target || defineProperty(Target, key, {
        configurable: true,
        get: function () { return Source[key]; },
        set: function (it) { Source[key] = it; }
      });
    };

    var DESCRIPTORS = descriptors;
    var global$1 = global$u;
    var uncurryThis = functionUncurryThis;
    var isForced = isForced_1;
    var inheritIfRequired = inheritIfRequired$3;
    var createNonEnumerableProperty = createNonEnumerableProperty$7;
    var getOwnPropertyNames = objectGetOwnPropertyNames.f;
    var isPrototypeOf = objectIsPrototypeOf;
    var isRegExp = isRegexp;
    var toString = toString$f;
    var getRegExpFlags = regexpGetFlags;
    var stickyHelpers = regexpStickyHelpers;
    var proxyAccessor = proxyAccessor$1;
    var defineBuiltIn = defineBuiltIn$f;
    var fails$1 = fails$G;
    var hasOwn = hasOwnProperty_1;
    var enforceInternalState = internalState.enforce;
    var setSpecies = setSpecies$3;
    var wellKnownSymbol = wellKnownSymbol$q;
    var UNSUPPORTED_DOT_ALL = regexpUnsupportedDotAll;
    var UNSUPPORTED_NCG = regexpUnsupportedNcg;

    var MATCH = wellKnownSymbol('match');
    var NativeRegExp = global$1.RegExp;
    var RegExpPrototype = NativeRegExp.prototype;
    var SyntaxError = global$1.SyntaxError;
    var exec = uncurryThis(RegExpPrototype.exec);
    var charAt = uncurryThis(''.charAt);
    var replace = uncurryThis(''.replace);
    var stringIndexOf = uncurryThis(''.indexOf);
    var stringSlice = uncurryThis(''.slice);
    // TODO: Use only proper RegExpIdentifierName
    var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
    var re1 = /a/g;
    var re2 = /a/g;

    // "new" should create a new object, old webkit bug
    var CORRECT_NEW = new NativeRegExp(re1) !== re1;

    var MISSED_STICKY = stickyHelpers.MISSED_STICKY;
    var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;

    var BASE_FORCED = DESCRIPTORS &&
      (!CORRECT_NEW || MISSED_STICKY || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG || fails$1(function () {
        re2[MATCH] = false;
        // RegExp constructor can alter flags and IsRegExp works correct with @@match
        return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
      }));

    var handleDotAll = function (string) {
      var length = string.length;
      var index = 0;
      var result = '';
      var brackets = false;
      var chr;
      for (; index <= length; index++) {
        chr = charAt(string, index);
        if (chr === '\\') {
          result += chr + charAt(string, ++index);
          continue;
        }
        if (!brackets && chr === '.') {
          result += '[\\s\\S]';
        } else {
          if (chr === '[') {
            brackets = true;
          } else if (chr === ']') {
            brackets = false;
          } result += chr;
        }
      } return result;
    };

    var handleNCG = function (string) {
      var length = string.length;
      var index = 0;
      var result = '';
      var named = [];
      var names = {};
      var brackets = false;
      var ncg = false;
      var groupid = 0;
      var groupname = '';
      var chr;
      for (; index <= length; index++) {
        chr = charAt(string, index);
        if (chr === '\\') {
          chr = chr + charAt(string, ++index);
        } else if (chr === ']') {
          brackets = false;
        } else if (!brackets) switch (true) {
          case chr === '[':
            brackets = true;
            break;
          case chr === '(':
            if (exec(IS_NCG, stringSlice(string, index + 1))) {
              index += 2;
              ncg = true;
            }
            result += chr;
            groupid++;
            continue;
          case chr === '>' && ncg:
            if (groupname === '' || hasOwn(names, groupname)) {
              throw new SyntaxError('Invalid capture group name');
            }
            names[groupname] = true;
            named[named.length] = [groupname, groupid];
            ncg = false;
            groupname = '';
            continue;
        }
        if (ncg) groupname += chr;
        else result += chr;
      } return [result, named];
    };

    // `RegExp` constructor
    // https://tc39.es/ecma262/#sec-regexp-constructor
    if (isForced('RegExp', BASE_FORCED)) {
      var RegExpWrapper = function RegExp(pattern, flags) {
        var thisIsRegExp = isPrototypeOf(RegExpPrototype, this);
        var patternIsRegExp = isRegExp(pattern);
        var flagsAreUndefined = flags === undefined;
        var groups = [];
        var rawPattern = pattern;
        var rawFlags, dotAll, sticky, handled, result, state;

        if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
          return pattern;
        }

        if (patternIsRegExp || isPrototypeOf(RegExpPrototype, pattern)) {
          pattern = pattern.source;
          if (flagsAreUndefined) flags = getRegExpFlags(rawPattern);
        }

        pattern = pattern === undefined ? '' : toString(pattern);
        flags = flags === undefined ? '' : toString(flags);
        rawPattern = pattern;

        if (UNSUPPORTED_DOT_ALL && 'dotAll' in re1) {
          dotAll = !!flags && stringIndexOf(flags, 's') > -1;
          if (dotAll) flags = replace(flags, /s/g, '');
        }

        rawFlags = flags;

        if (MISSED_STICKY && 'sticky' in re1) {
          sticky = !!flags && stringIndexOf(flags, 'y') > -1;
          if (sticky && UNSUPPORTED_Y) flags = replace(flags, /y/g, '');
        }

        if (UNSUPPORTED_NCG) {
          handled = handleNCG(pattern);
          pattern = handled[0];
          groups = handled[1];
        }

        result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype, RegExpWrapper);

        if (dotAll || sticky || groups.length) {
          state = enforceInternalState(result);
          if (dotAll) {
            state.dotAll = true;
            state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
          }
          if (sticky) state.sticky = true;
          if (groups.length) state.groups = groups;
        }

        if (pattern !== rawPattern) try {
          // fails in old engines, but we have no alternatives for unsupported regex syntax
          createNonEnumerableProperty(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
        } catch (error) { /* empty */ }

        return result;
      };

      for (var keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index;) {
        proxyAccessor(RegExpWrapper, NativeRegExp, keys[index++]);
      }

      RegExpPrototype.constructor = RegExpWrapper;
      RegExpWrapper.prototype = RegExpPrototype;
      defineBuiltIn(global$1, 'RegExp', RegExpWrapper, { constructor: true });
    }

    // https://tc39.es/ecma262/#sec-get-regexp-@@species
    setSpecies('RegExp');

    var sqlEngine = {};

    var $$2 = _export;
    var $find = arrayIteration.find;
    var addToUnscopables$1 = addToUnscopables$4;

    var FIND = 'find';
    var SKIPS_HOLES$1 = true;

    // Shouldn't skip holes
    if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES$1 = false; });

    // `Array.prototype.find` method
    // https://tc39.es/ecma262/#sec-array.prototype.find
    $$2({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 }, {
      find: function find(callbackfn /* , that = undefined */) {
        return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
      }
    });

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables$1(FIND);

    var $$1 = _export;
    var $findIndex = arrayIteration.findIndex;
    var addToUnscopables = addToUnscopables$4;

    var FIND_INDEX = 'findIndex';
    var SKIPS_HOLES = true;

    // Shouldn't skip holes
    if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

    // `Array.prototype.findIndex` method
    // https://tc39.es/ecma262/#sec-array.prototype.findindex
    $$1({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
      findIndex: function findIndex(callbackfn /* , that = undefined */) {
        return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
      }
    });

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables(FIND_INDEX);

    var PROPER_FUNCTION_NAME = functionName.PROPER;
    var fails = fails$G;
    var whitespaces = whitespaces$3;

    var non = '\u200B\u0085\u180E';

    // check that a method works with the correct list
    // of whitespaces and has a correct name
    var stringTrimForced = function (METHOD_NAME) {
      return fails(function () {
        return !!whitespaces[METHOD_NAME]()
          || non[METHOD_NAME]() !== non
          || (PROPER_FUNCTION_NAME && whitespaces[METHOD_NAME].name !== METHOD_NAME);
      });
    };

    var $ = _export;
    var $trim = stringTrim.trim;
    var forcedStringTrimMethod = stringTrimForced;

    // `String.prototype.trim` method
    // https://tc39.es/ecma262/#sec-string.prototype.trim
    $({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
      trim: function trim() {
        return $trim(this);
      }
    });

    Object.defineProperty(sqlEngine, "__esModule", {
      value: true
    });
    sqlEngine.default = sqlParser;

    var _reusables = reusables;

    var _errors$1 = errors;

    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

    function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

    function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

    function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

    function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

    function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

    var REPLACMENTS = [["INNER JOIN", "INNERJOIN"], ["LEFT JOIN", "LEFTJOIN"], ["RIGHT JOIN", "RIGHTJOIN"], ["FULL JOIN", "FULLJOIN"], ["GROUP BY", "GROUPBY"]];
    var WHERE_OPERATORS = {
      IN: function IN(a, b) {
        return b.includes(a);
      },
      LIKE: function LIKE(a, b) {
        return b.includes(a) || a.includes(b);
      },
      ">=": function _(a, b) {
        return a >= b;
      },
      "<=": function _(a, b) {
        return a <= b;
      },
      "!=": function _(a, b) {
        return a !== b;
      },
      "<": function _(a, b) {
        return a < b;
      },
      ">": function _(a, b) {
        return a > b;
      },
      "=": function _(a, b) {
        return a === b;
      },
      AND: function AND(a, b) {
        return a && b;
      },
      OR: function OR(a, b) {
        return a || b;
      }
    };
    var SELECT_FUNCTIONS = {
      COUNT: function COUNT(df) {
        return df.count();
      },
      SUM: function SUM(df, column) {
        return df.stat.sum(column);
      },
      MAX: function MAX(df, column) {
        return df.stat.max(column);
      },
      MIN: function MIN(df, column) {
        return df.stat.min(column);
      },
      AVG: function AVG(df, column) {
        return df.stat.mean(column);
      }
    };

    function match(value) {
      for (var _len = arguments.length, cases = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        cases[_key - 1] = arguments[_key];
      }

      var casesGen = (0, _reusables.makeGenerator)(cases);

      var checker = function checker(nextCase) {
        return nextCase[0](value) ? nextCase[1](value) : checker(casesGen.next().value);
      };

      return checker(casesGen.next().value);
    }

    function sqlArgsToArray(args) {
      return (0, _reusables.xReplace)(args.join(" "), [" ", ""]).split(",");
    }

    function joinHandler(operation, tables, type) {
      var ONKeywordLocation = operation.findIndex(function (word) {
        return word.toUpperCase() === "ON";
      }) + 1;
      return function (df) {
        return df.join(tables[operation[0]], sqlArgsToArray(operation.filter(function (word, loc) {
          return loc >= ONKeywordLocation;
        })), type);
      };
    }

    var OPERATIONS_HANDLER = {
      WHERE: function WHERE(operation) {
        var operationalTerms = (0, _reusables.xSplit)(operation.join(" "), " AND ", " OR ");
        return function (df) {
          return df.filter(function (row) {
            var conditionalOperators = operation.filter(function (term) {
              return ["AND", "OR"].includes(term.toUpperCase());
            });
            return operationalTerms.map(function (operationalTerm) {
              var operatorToApply = _reusables.xContains.apply(void 0, [operationalTerm].concat(_toConsumableArray(Object.keys(WHERE_OPERATORS))))[0];

              var terms = operationalTerm.split(operatorToApply).map(function (term) {
                return term.trim();
              });

              if (!row.has(terms[0]) && row.has(terms[1])) {
                return WHERE_OPERATORS[operatorToApply]((0, _reusables.xReplace)(terms[0].trim(), ['"', ""], ["'", ""], ["`", ""]), String(row.get(terms[1])));
              }

              var lastTermAsNumber = Number(terms[1]);
              return WHERE_OPERATORS[operatorToApply](String(row.get(terms[0])), Number.isNaN(lastTermAsNumber) ? (0, _reusables.xReplace)(terms[1].trim(), ['"', ""], ["'", ""], ["`", ""]) : lastTermAsNumber);
            }).reduce(function (prev, next) {
              return WHERE_OPERATORS[conditionalOperators.shift()](prev, next);
            });
          });
        };
      },
      JOIN: function JOIN(operation, tables) {
        return joinHandler(operation, tables, "inner");
      },
      INNERJOIN: function INNERJOIN(operation, tables) {
        return joinHandler(operation, tables, "inner");
      },
      LEFTJOIN: function LEFTJOIN(operation, tables) {
        return joinHandler(operation, tables, "left");
      },
      RIGHTJOIN: function RIGHTJOIN(operation, tables) {
        return joinHandler(operation, tables, "right");
      },
      FULLJOIN: function FULLJOIN(operation, tables) {
        return joinHandler(operation, tables, "full");
      },
      UNION: function UNION(operation, tables) {
        return function (df) {
          return df.union(operation[0].toUpperCase().includes("SELECT") ? sqlParser(operation.join(" "), tables) : tables[operation[0]]);
        };
      },
      GROUPBY: function GROUPBY(operation) {
        return function (df) {
          return df.groupBy.apply(df, _toConsumableArray(sqlArgsToArray(operation)));
        };
      }
    };

    function replaceTermsInQuery(query) {
      var replacedQuery = query;
      REPLACMENTS.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            joinType = _ref2[0],
            replacment = _ref2[1];

        replacedQuery = replacedQuery.replace(joinType, replacment).replace(joinType.toLowerCase(), replacment);
      });
      return replacedQuery;
    }

    function sqlSplitter(query) {
      var splittedQuery = replaceTermsInQuery(query).split(" ");
      var fromLoc = splittedQuery.findIndex(function (word) {
        return word.toUpperCase() === "FROM";
      });

      if (fromLoc === -1) {
        throw new _errors$1.SQLParseError("Your query should contains FROM keyword");
      }

      return {
        selections: splittedQuery.slice(0, fromLoc),
        table: splittedQuery[fromLoc + 1],
        operations: splittedQuery.slice(fromLoc + 2, splittedQuery.length)
      };
    }

    function parseOperations(operations, tables) {
      var operationsLoc = operations.map(function (word, index) {
        return Object.keys(OPERATIONS_HANDLER).includes(word.toUpperCase()) ? index : undefined;
      }).filter(function (loc) {
        return loc !== undefined;
      });
      return operationsLoc.map(function (loc, index) {
        return OPERATIONS_HANDLER[operations[loc].toUpperCase()](operations.slice(loc + 1, operationsLoc[index + 1] ? operationsLoc[index + 1] : operations.length), tables);
      }).reduce(function (prev, next) {
        return function (df) {
          return next(prev(df));
        };
      }, function (df) {
        return df;
      });
    }

    function parseSelections(selections) {
      if (selections[0].toUpperCase() !== "SELECT") {
        throw new _errors$1.SQLParseError("Your query should begin with SELECT keyword");
      }

      selections.shift();
      return match(selections.join(" ").split(",").map(function (selection) {
        return selection.trim();
      }), [function (value) {
        return (0, _reusables.xReplace)(value[0], [" ", ""]) === "*";
      }, function () {
        return function (df) {
          return df;
        };
      }], [function (value) {
        return value[0].toUpperCase().includes("DISTINCT");
      }, function (value) {
        var columnName = (0, _reusables.xReplace)(value[0].split(" AS ")[0], ["DISTINCT", ""], ["distinct", ""], [" ", ""]);
        return function (df) {
          return df.distinct(columnName).rename(columnName, value[0].includes("AS") ? value[0].split("AS")[1].replace(" ", "") : columnName);
        };
      }], [function (value) {
        return _reusables.xContains.apply(void 0, [value[0].toUpperCase()].concat(_toConsumableArray(Object.keys(SELECT_FUNCTIONS))))[0];
      }, function (value) {
        return function (df) {
          var functionToApply = Object.keys(SELECT_FUNCTIONS).find(function (func) {
            return value[0].toUpperCase().includes(func);
          });

          var applyFunction = function applyFunction(dfToImpact) {
            return SELECT_FUNCTIONS[functionToApply](dfToImpact, (0, _reusables.xReplace)(value[0], ["".concat(functionToApply.toLowerCase(), "("), ""], ["".concat(functionToApply, "("), ""], ["(", ""], [")", ""]));
          };

          return df.on && df.df ? df.aggregate(applyFunction) : applyFunction(df);
        };
      }], [function () {
        return true;
      }, function (value) {
        return function (df) {
          return df.select.apply(df, _toConsumableArray(value.map(function (column) {
            return column.split(" AS ")[0].replace(" ", "");
          }))).renameAll(value.map(function (column) {
            return column.includes("AS") ? column.split("AS")[1].replace(" ", "") : column;
          }));
        };
      }]);
    }

    function sqlParser(query, tables) {
      var _sqlSplitter = sqlSplitter(query),
          selections = _sqlSplitter.selections,
          table = _sqlSplitter.table,
          operations = _sqlSplitter.operations;

      if (!table || !Object.keys(tables).includes(table)) {
        throw new _errors$1.SQLParseError("Wrong table name in your query: ".concat(table));
      }

      var applyOperations = parseOperations(operations, tables);
      var applySelections = parseSelections(selections);
      return applySelections(applyOperations(tables[table]));
    }

    Object.defineProperty(sql, "__esModule", {
      value: true
    });
    sql.default = void 0;

    var _sqlEngine = _interopRequireDefault(sqlEngine);

    var _dataframe = _interopRequireDefault(dataframe);

    var _errors = errors;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    var SQL = function () {
      _createClass(SQL, null, [{
        key: "request",
        value: function request(query) {
          if (!(typeof query === "string")) throw new _errors.ArgumentTypeError(query, "Stri g");
          return (0, _sqlEngine.default)(query, SQL.tables);
        }
      }, {
        key: "dropTables",
        value: function dropTables() {
          SQL.tables = {};
        }
      }, {
        key: "dropTable",
        value: function dropTable(tableName) {
          delete SQL.tables[tableName];
        }
      }, {
        key: "renameTable",
        value: function renameTable(tableName, replacement) {
          var overwrite = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          SQL.registerTable(SQL.tables[tableName], replacement, overwrite);
          SQL.dropTable(tableName);
        }
      }, {
        key: "listTables",
        value: function listTables() {
          return Object.keys(SQL.tables);
        }
      }, {
        key: "registerTable",
        value: function registerTable(df, tableName) {
          var overwrite = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
          if (!(df instanceof _dataframe.default)) throw new _errors.ArgumentTypeError(df, "DataFrame");
          var validation = new RegExp("^[a-zA-Z_][a-zA-Z0-9_]*$");

          if (!validation.test(tableName)) {
            throw new _errors.WrongTableNameError(tableName);
          }

          if (SQL.listTables().includes(tableName) && !overwrite) {
            throw new _errors.TableAlreadyExistsError(tableName);
          }

          SQL.tables[tableName] = df;
        }
      }]);

      function SQL(df) {
        _classCallCheck(this, SQL);

        this.df = df;
        this.name = "sql";
      }

      _createClass(SQL, [{
        key: "register",
        value: function register(tableName) {
          var overwrite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          SQL.registerTable(this.df, tableName, overwrite);
          return this.df;
        }
      }]);

      return SQL;
    }();

    SQL.tables = {};
    var _default = SQL;
    sql.default = _default;

    (function (exports) {



    	Object.defineProperty(exports, "__esModule", {
    	  value: true
    	});
    	Object.defineProperty(exports, "DataFrame", {
    	  enumerable: true,
    	  get: function get() {
    	    return _dataframe.default;
    	  }
    	});
    	Object.defineProperty(exports, "Row", {
    	  enumerable: true,
    	  get: function get() {
    	    return _row.default;
    	  }
    	});
    	exports.Errors = exports.default = void 0;

    	var _dataframe = _interopRequireDefault(dataframe);

    	var _row = _interopRequireDefault(row);

    	var Errors = _interopRequireWildcard(errors);

    	exports.Errors = Errors;

    	var _stat = _interopRequireDefault(stat);

    	var _matrix = _interopRequireDefault(matrix);

    	var _index = _interopRequireDefault(sql);

    	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

    	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    	_dataframe.default.setDefaultModules(_stat.default, _matrix.default, _index.default);

    	_dataframe.default.sql = _index.default;
    	var _default = _dataframe.default;
    	exports.default = _default;
    } (lib));

    var DataFrame = /*@__PURE__*/getDefaultExportFromCjs(lib);

    /* src\components\vcftophylogenetic.svelte generated by Svelte v3.54.0 */

    const { console: console_1$1 } = globals;
    const file$1 = "src\\components\\vcftophylogenetic.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    function get_each_context_7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    function get_each_context_8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[52] = list[i];
    	return child_ctx;
    }

    // (260:8) {#if result !== null}
    function create_if_block_16(ctx) {
    	let div2;
    	let div0;
    	let datatable;
    	let updating_dataRows;
    	let t;
    	let div1;
    	let current;

    	function datatable_dataRows_binding(value) {
    		/*datatable_dataRows_binding*/ ctx[25](value);
    	}

    	let datatable_props = {
    		settings: /*datatableSettings*/ ctx[20],
    		data: /*result*/ ctx[1],
    		id: 'datatable-genes',
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*rows*/ ctx[0] !== void 0) {
    		datatable_props.dataRows = /*rows*/ ctx[0];
    	}

    	datatable = new Datatable_1({ props: datatable_props, $$inline: true });
    	binding_callbacks.push(() => bind$m(datatable, 'dataRows', datatable_dataRows_binding, /*rows*/ ctx[0]));
    	let if_block = /*$rows*/ ctx[18] && create_if_block_17(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(datatable.$$.fragment);
    			t = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			set_style(div0, "height", "400px");
    			add_location(div0, file$1, 263, 12, 8266);
    			attr_dev(div1, "class", "clearfix");
    			add_location(div1, file$1, 296, 12, 9768);
    			attr_dev(div2, "class", "box");
    			set_style(div2, "margin-top", "15px");
    			set_style(div2, "background", "rgb(242,242,242)");
    			set_style(div2, "border-radius", "8px");
    			set_style(div2, "padding", "10px");
    			add_location(div2, file$1, 260, 8, 8009);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(datatable, div0, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const datatable_changes = {};
    			if (dirty[0] & /*result*/ 2) datatable_changes.data = /*result*/ ctx[1];

    			if (dirty[0] & /*$rows, chromosomes, rows*/ 327681 | dirty[1] & /*$$scope*/ 16777216) {
    				datatable_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_dataRows && dirty[0] & /*rows*/ 1) {
    				updating_dataRows = true;
    				datatable_changes.dataRows = /*rows*/ ctx[0];
    				add_flush_callback(() => updating_dataRows = false);
    			}

    			datatable.$set(datatable_changes);

    			if (/*$rows*/ ctx[18]) {
    				if (if_block) {
    					if (dirty[0] & /*$rows*/ 262144) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_17(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datatable.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datatable.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(datatable);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(260:8) {#if result !== null}",
    		ctx
    	});

    	return block;
    }

    // (277:20) {#if rows}
    function create_if_block_18(ctx) {
    	let each_1_anchor;
    	let each_value_9 = /*$rows*/ ctx[18];
    	validate_each_argument(each_value_9);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_9.length; i += 1) {
    		each_blocks[i] = create_each_block_9(get_each_context_9(ctx, each_value_9, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*calc, chromosomes, $rows*/ 4521984) {
    				each_value_9 = /*$rows*/ ctx[18];
    				validate_each_argument(each_value_9);
    				let i;

    				for (i = 0; i < each_value_9.length; i += 1) {
    					const child_ctx = get_each_context_9(ctx, each_value_9, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_9.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_18.name,
    		type: "if",
    		source: "(277:20) {#if rows}",
    		ctx
    	});

    	return block;
    }

    // (278:20) {#each $rows as row}
    function create_each_block_9(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*row*/ ctx[52].ID + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*row*/ ctx[52].type + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*row*/ ctx[52].description + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*row*/ ctx[52].seqid + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*row*/ ctx[52].start + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*row*/ ctx[52].end + "";
    	let t10;
    	let t11;
    	let td6;
    	let a;
    	let t13;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[24](/*row*/ ctx[52]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text$1(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text$1(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text$1(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text$1(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text$1(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text$1(t10_value);
    			t11 = space();
    			td6 = element("td");
    			a = element("a");
    			a.textContent = "show";
    			t13 = space();
    			attr_dev(td0, "class", "id");
    			set_style(td0, "width", "230px");
    			add_location(td0, file$1, 279, 24, 8985);
    			attr_dev(td1, "class", "desc");
    			set_style(td1, "width", "80px");
    			add_location(td1, file$1, 280, 24, 9060);
    			attr_dev(td2, "class", "desc");
    			set_style(td2, "width", "330px");
    			add_location(td2, file$1, 281, 24, 9138);
    			attr_dev(td3, "class", "centered svelte-fz2yc6");
    			add_location(td3, file$1, 282, 24, 9224);
    			attr_dev(td4, "class", "centered svelte-fz2yc6");
    			add_location(td4, file$1, 283, 24, 9287);
    			attr_dev(td5, "class", "centered svelte-fz2yc6");
    			add_location(td5, file$1, 284, 24, 9350);
    			attr_dev(a, "href", "#");
    			add_location(a, file$1, 288, 28, 9453);
    			add_location(td6, file$1, 288, 24, 9449);
    			add_location(tr, file$1, 278, 20, 8955);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			append_dev(td6, a);
    			append_dev(tr, t13);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", prevent_default(click_handler), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$rows*/ 262144 && t0_value !== (t0_value = /*row*/ ctx[52].ID + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*$rows*/ 262144 && t2_value !== (t2_value = /*row*/ ctx[52].type + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*$rows*/ 262144 && t4_value !== (t4_value = /*row*/ ctx[52].description + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*$rows*/ 262144 && t6_value !== (t6_value = /*row*/ ctx[52].seqid + "")) set_data_dev(t6, t6_value);
    			if (dirty[0] & /*$rows*/ 262144 && t8_value !== (t8_value = /*row*/ ctx[52].start + "")) set_data_dev(t8, t8_value);
    			if (dirty[0] & /*$rows*/ 262144 && t10_value !== (t10_value = /*row*/ ctx[52].end + "")) set_data_dev(t10, t10_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_9.name,
    		type: "each",
    		source: "(278:20) {#each $rows as row}",
    		ctx
    	});

    	return block;
    }

    // (265:12) <Datatable settings={datatableSettings} data={result} bind:dataRows={rows} id={'datatable-genes'}>
    function create_default_slot(ctx) {
    	let thead;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t12;
    	let tbody;
    	let if_block = /*rows*/ ctx[0] && create_if_block_18(ctx);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "ID";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Type";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Description";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Chromosome";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Start position";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "End position";
    			t11 = space();
    			th6 = element("th");
    			t12 = space();
    			tbody = element("tbody");
    			if (if_block) if_block.c();
    			attr_dev(th0, "data-key", "id");
    			add_location(th0, file$1, 266, 20, 8452);
    			attr_dev(th1, "data-key", "type");
    			add_location(th1, file$1, 267, 20, 8499);
    			attr_dev(th2, "data-key", "description");
    			add_location(th2, file$1, 268, 20, 8550);
    			attr_dev(th3, "data-key", "seqid");
    			add_location(th3, file$1, 269, 20, 8615);
    			attr_dev(th4, "data-key", "start");
    			add_location(th4, file$1, 270, 20, 8673);
    			attr_dev(th5, "data-key", "end");
    			add_location(th5, file$1, 271, 20, 8735);
    			add_location(th6, file$1, 273, 20, 8799);
    			add_location(thead, file$1, 265, 16, 8423);
    			add_location(tbody, file$1, 275, 16, 8852);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, th0);
    			append_dev(thead, t1);
    			append_dev(thead, th1);
    			append_dev(thead, t3);
    			append_dev(thead, th2);
    			append_dev(thead, t5);
    			append_dev(thead, th3);
    			append_dev(thead, t7);
    			append_dev(thead, th4);
    			append_dev(thead, t9);
    			append_dev(thead, th5);
    			append_dev(thead, t11);
    			append_dev(thead, th6);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, tbody, anchor);
    			if (if_block) if_block.m(tbody, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*rows*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_18(ctx);
    					if_block.c();
    					if_block.m(tbody, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(tbody);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(265:12) <Datatable settings={datatableSettings} data={result} bind:dataRows={rows} id={'datatable-genes'}>",
    		ctx
    	});

    	return block;
    }

    // (298:12) {#if $rows}
    function create_if_block_17(ctx) {
    	let paginationbuttons;
    	let t;
    	let paginationrowcount;
    	let current;

    	paginationbuttons = new PaginationButtons({
    			props: { id: 'datatable-genes' },
    			$$inline: true
    		});

    	paginationrowcount = new PaginationRowCount({
    			props: { id: 'datatable-genes' },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationbuttons.$$.fragment);
    			t = space();
    			create_component(paginationrowcount.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationbuttons, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(paginationrowcount, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationbuttons.$$.fragment, local);
    			transition_in(paginationrowcount.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationbuttons.$$.fragment, local);
    			transition_out(paginationrowcount.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationbuttons, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(paginationrowcount, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(298:12) {#if $rows}",
    		ctx
    	});

    	return block;
    }

    // (314:12) {#each chromosomes as chromosome}
    function create_each_block_8(ctx) {
    	let option;
    	let t0_value = /*chromosome*/ ctx[23].id + "";
    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text$1(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*chromosome*/ ctx[23];
    			option.value = option.__value;
    			add_location(option, file$1, 314, 16, 10241);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*chromosomes*/ 65536 && t0_value !== (t0_value = /*chromosome*/ ctx[23].id + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*chromosomes*/ 65536 && option_value_value !== (option_value_value = /*chromosome*/ ctx[23])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_8.name,
    		type: "each",
    		source: "(314:12) {#each chromosomes as chromosome}",
    		ctx
    	});

    	return block;
    }

    // (391:8) {#if static_genotype_1 != null }
    function create_if_block_14(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let p0;
    	let t2;
    	let t3_value = /*passimory*/ ctx[11][0] + "";
    	let t3;
    	let t4;
    	let p1;
    	let t5;
    	let t6_value = /*running_time*/ ctx[12]['genotype'] + "";
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let table;
    	let thead;
    	let th0;
    	let t11;
    	let th1;
    	let t13;
    	let th2;
    	let t15;
    	let th3;
    	let t17;
    	let tbody;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let if_block = /*NNI*/ ctx[15] == "yes" && create_if_block_15(ctx);
    	let each_value_7 = Array(/*static_genotype_1*/ ctx[2]["Model"].length);
    	validate_each_argument(each_value_7);
    	const get_key = ctx => /*index*/ ctx[42];
    	validate_each_keys(ctx, each_value_7, get_each_context_7, get_key);

    	for (let i = 0; i < each_value_7.length; i += 1) {
    		let child_ctx = get_each_context_7(ctx, each_value_7, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_7(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "genotype based phylogenetic statistics(single-linkage clustering)";
    			t1 = space();
    			p0 = element("p");
    			t2 = text$1("passimory : ");
    			t3 = text$1(t3_value);
    			t4 = space();
    			p1 = element("p");
    			t5 = text$1("running time : ");
    			t6 = text$1(t6_value);
    			t7 = text$1(" sec.");
    			t8 = space();
    			if (if_block) if_block.c();
    			t9 = space();
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Model";
    			t11 = space();
    			th1 = element("th");
    			th1.textContent = "logLik";
    			t13 = space();
    			th2 = element("th");
    			th2.textContent = "AIC";
    			t15 = space();
    			th3 = element("th");
    			th3.textContent = "BIC";
    			t17 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$1, 394, 12, 12684);
    			add_location(p0, file$1, 395, 12, 12772);
    			add_location(p1, file$1, 396, 12, 12819);
    			attr_dev(th0, "data-key", "Model");
    			add_location(th0, file$1, 405, 20, 13085);
    			attr_dev(th1, "data-key", "Model");
    			add_location(th1, file$1, 406, 20, 13138);
    			attr_dev(th2, "data-key", "Model");
    			add_location(th2, file$1, 407, 20, 13192);
    			attr_dev(th3, "data-key", "Model");
    			add_location(th3, file$1, 408, 20, 13243);
    			add_location(thead, file$1, 404, 16, 13056);
    			add_location(tbody, file$1, 411, 16, 13322);
    			add_location(table, file$1, 403, 12, 13030);
    			attr_dev(div, "class", "phylogenetic_score box svelte-fz2yc6");
    			set_style(div, "margin-top", "15px");
    			set_style(div, "background", "rgb(242,242,242)");
    			set_style(div, "border-radius", "8px");
    			set_style(div, "padding", "10px");
    			add_location(div, file$1, 393, 8, 12544);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, t3);
    			append_dev(div, t4);
    			append_dev(div, p1);
    			append_dev(p1, t5);
    			append_dev(p1, t6);
    			append_dev(p1, t7);
    			append_dev(div, t8);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t9);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t11);
    			append_dev(thead, th1);
    			append_dev(thead, t13);
    			append_dev(thead, th2);
    			append_dev(thead, t15);
    			append_dev(thead, th3);
    			append_dev(table, t17);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*passimory*/ 2048 && t3_value !== (t3_value = /*passimory*/ ctx[11][0] + "")) set_data_dev(t3, t3_value);
    			if (dirty[0] & /*running_time*/ 4096 && t6_value !== (t6_value = /*running_time*/ ctx[12]['genotype'] + "")) set_data_dev(t6, t6_value);

    			if (/*NNI*/ ctx[15] == "yes") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_15(ctx);
    					if_block.c();
    					if_block.m(div, t9);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*static_genotype_1*/ 4) {
    				each_value_7 = Array(/*static_genotype_1*/ ctx[2]["Model"].length);
    				validate_each_argument(each_value_7);
    				validate_each_keys(ctx, each_value_7, get_each_context_7, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_7, each_1_lookup, tbody, destroy_block, create_each_block_7, null, get_each_context_7);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(391:8) {#if static_genotype_1 != null }",
    		ctx
    	});

    	return block;
    }

    // (399:12) {#if NNI == "yes" }
    function create_if_block_15(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*Repeat_nni*/ ctx[10]['single'] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1("Repeated NNI : ");
    			t1 = text$1(t1_value);
    			add_location(p, file$1, 399, 17, 12931);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*Repeat_nni*/ 1024 && t1_value !== (t1_value = /*Repeat_nni*/ ctx[10]['single'] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(399:12) {#if NNI == \\\"yes\\\" }",
    		ctx
    	});

    	return block;
    }

    // (414:20) {#each Array(static_genotype_1["Model"].length) as _, index (index)}
    function create_each_block_7(key_1, ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*static_genotype_1*/ ctx[2]["Model"][/*index*/ ctx[42]] + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*static_genotype_1*/ ctx[2]["logLik"][/*index*/ ctx[42]] + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*static_genotype_1*/ ctx[2]["AIC"][/*index*/ ctx[42]] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*static_genotype_1*/ ctx[2]["BIC"][/*index*/ ctx[42]] + "";
    	let t6;
    	let t7;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text$1(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text$1(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text$1(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text$1(t6_value);
    			t7 = space();
    			attr_dev(td0, "class", "id svelte-fz2yc6");
    			set_style(td0, "width", "230px");
    			add_location(td0, file$1, 415, 24, 13519);
    			attr_dev(td1, "class", "id svelte-fz2yc6");
    			set_style(td1, "width", "230px");
    			add_location(td1, file$1, 416, 24, 13622);
    			attr_dev(td2, "class", "id svelte-fz2yc6");
    			set_style(td2, "width", "230px");
    			add_location(td2, file$1, 417, 24, 13726);
    			attr_dev(td3, "class", "id svelte-fz2yc6");
    			set_style(td3, "width", "230px");
    			add_location(td3, file$1, 418, 24, 13827);
    			set_style(tr, "border-color", "black");
    			add_location(tr, file$1, 414, 20, 13460);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*static_genotype_1*/ 4 && t0_value !== (t0_value = /*static_genotype_1*/ ctx[2]["Model"][/*index*/ ctx[42]] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*static_genotype_1*/ 4 && t2_value !== (t2_value = /*static_genotype_1*/ ctx[2]["logLik"][/*index*/ ctx[42]] + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*static_genotype_1*/ 4 && t4_value !== (t4_value = /*static_genotype_1*/ ctx[2]["AIC"][/*index*/ ctx[42]] + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*static_genotype_1*/ 4 && t6_value !== (t6_value = /*static_genotype_1*/ ctx[2]["BIC"][/*index*/ ctx[42]] + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_7.name,
    		type: "each",
    		source: "(414:20) {#each Array(static_genotype_1[\\\"Model\\\"].length) as _, index (index)}",
    		ctx
    	});

    	return block;
    }

    // (433:8) {#if static_genotype_2 != null }
    function create_if_block_12(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let p;
    	let t2;
    	let t3_value = /*passimory*/ ctx[11][1] + "";
    	let t3;
    	let t4;
    	let t5;
    	let table;
    	let thead;
    	let th0;
    	let t7;
    	let th1;
    	let t9;
    	let th2;
    	let t11;
    	let th3;
    	let t13;
    	let tbody;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let if_block = /*NNI*/ ctx[15] == "yes" && create_if_block_13(ctx);
    	let each_value_6 = Array(/*static_genotype_2*/ ctx[3]["Model"].length);
    	validate_each_argument(each_value_6);
    	const get_key = ctx => /*index*/ ctx[42];
    	validate_each_keys(ctx, each_value_6, get_each_context_6, get_key);

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		let child_ctx = get_each_context_6(ctx, each_value_6, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_6(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "genotype based phylogenetic statistics(complete-linkage clustering)";
    			t1 = space();
    			p = element("p");
    			t2 = text$1("passimory : ");
    			t3 = text$1(t3_value);
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Model";
    			t7 = space();
    			th1 = element("th");
    			th1.textContent = "logLik";
    			t9 = space();
    			th2 = element("th");
    			th2.textContent = "AIC";
    			t11 = space();
    			th3 = element("th");
    			th3.textContent = "BIC";
    			t13 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$1, 435, 12, 14301);
    			add_location(p, file$1, 436, 12, 14391);
    			attr_dev(th0, "data-key", "Model");
    			add_location(th0, file$1, 444, 20, 14617);
    			attr_dev(th1, "data-key", "Model");
    			add_location(th1, file$1, 445, 20, 14670);
    			attr_dev(th2, "data-key", "Model");
    			add_location(th2, file$1, 446, 20, 14724);
    			attr_dev(th3, "data-key", "Model");
    			add_location(th3, file$1, 447, 20, 14775);
    			add_location(thead, file$1, 443, 16, 14588);
    			add_location(tbody, file$1, 450, 16, 14854);
    			add_location(table, file$1, 442, 12, 14562);
    			attr_dev(div, "class", "phylogenetic_score box svelte-fz2yc6");
    			set_style(div, "margin-top", "15px");
    			set_style(div, "background", "rgb(242,242,242)");
    			set_style(div, "border-radius", "8px");
    			set_style(div, "padding", "10px");
    			add_location(div, file$1, 434, 8, 14161);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(div, t4);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t5);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t7);
    			append_dev(thead, th1);
    			append_dev(thead, t9);
    			append_dev(thead, th2);
    			append_dev(thead, t11);
    			append_dev(thead, th3);
    			append_dev(table, t13);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*passimory*/ 2048 && t3_value !== (t3_value = /*passimory*/ ctx[11][1] + "")) set_data_dev(t3, t3_value);

    			if (/*NNI*/ ctx[15] == "yes") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_13(ctx);
    					if_block.c();
    					if_block.m(div, t5);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*static_genotype_2*/ 8) {
    				each_value_6 = Array(/*static_genotype_2*/ ctx[3]["Model"].length);
    				validate_each_argument(each_value_6);
    				validate_each_keys(ctx, each_value_6, get_each_context_6, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_6, each_1_lookup, tbody, destroy_block, create_each_block_6, null, get_each_context_6);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(433:8) {#if static_genotype_2 != null }",
    		ctx
    	});

    	return block;
    }

    // (439:12) {#if NNI == "yes" }
    function create_if_block_13(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*Repeat_nni*/ ctx[10]['single'] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1("Repeated NNI : ");
    			t1 = text$1(t1_value);
    			add_location(p, file$1, 439, 12, 14477);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*Repeat_nni*/ 1024 && t1_value !== (t1_value = /*Repeat_nni*/ ctx[10]['single'] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(439:12) {#if NNI == \\\"yes\\\" }",
    		ctx
    	});

    	return block;
    }

    // (453:20) {#each Array(static_genotype_2["Model"].length) as _, index (index)}
    function create_each_block_6(key_1, ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*static_genotype_2*/ ctx[3]["Model"][/*index*/ ctx[42]] + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*static_genotype_2*/ ctx[3]["logLik"][/*index*/ ctx[42]] + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*static_genotype_2*/ ctx[3]["AIC"][/*index*/ ctx[42]] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*static_genotype_2*/ ctx[3]["BIC"][/*index*/ ctx[42]] + "";
    	let t6;
    	let t7;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text$1(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text$1(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text$1(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text$1(t6_value);
    			t7 = space();
    			attr_dev(td0, "class", "id svelte-fz2yc6");
    			set_style(td0, "width", "230px");
    			add_location(td0, file$1, 454, 24, 15051);
    			attr_dev(td1, "class", "id svelte-fz2yc6");
    			set_style(td1, "width", "230px");
    			add_location(td1, file$1, 455, 24, 15154);
    			attr_dev(td2, "class", "id svelte-fz2yc6");
    			set_style(td2, "width", "230px");
    			add_location(td2, file$1, 456, 24, 15258);
    			attr_dev(td3, "class", "id svelte-fz2yc6");
    			set_style(td3, "width", "230px");
    			add_location(td3, file$1, 457, 24, 15359);
    			set_style(tr, "border-color", "black");
    			add_location(tr, file$1, 453, 20, 14992);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*static_genotype_2*/ 8 && t0_value !== (t0_value = /*static_genotype_2*/ ctx[3]["Model"][/*index*/ ctx[42]] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*static_genotype_2*/ 8 && t2_value !== (t2_value = /*static_genotype_2*/ ctx[3]["logLik"][/*index*/ ctx[42]] + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*static_genotype_2*/ 8 && t4_value !== (t4_value = /*static_genotype_2*/ ctx[3]["AIC"][/*index*/ ctx[42]] + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*static_genotype_2*/ 8 && t6_value !== (t6_value = /*static_genotype_2*/ ctx[3]["BIC"][/*index*/ ctx[42]] + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(453:20) {#each Array(static_genotype_2[\\\"Model\\\"].length) as _, index (index)}",
    		ctx
    	});

    	return block;
    }

    // (472:8) {#if static_genotype_3 != null }
    function create_if_block_10(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let p;
    	let t2;
    	let t3_value = /*passimory*/ ctx[11][2] + "";
    	let t3;
    	let t4;
    	let t5;
    	let table;
    	let thead;
    	let th0;
    	let t7;
    	let th1;
    	let t9;
    	let th2;
    	let t11;
    	let th3;
    	let t13;
    	let tbody;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let if_block = /*NNI*/ ctx[15] == "yes" && create_if_block_11(ctx);
    	let each_value_5 = Array(/*static_genotype_3*/ ctx[4]["Model"].length);
    	validate_each_argument(each_value_5);
    	const get_key = ctx => /*index*/ ctx[42];
    	validate_each_keys(ctx, each_value_5, get_each_context_5, get_key);

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		let child_ctx = get_each_context_5(ctx, each_value_5, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_5(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "genotype based phylogenetic statistics(average-linkage clustering)";
    			t1 = space();
    			p = element("p");
    			t2 = text$1("passimory : ");
    			t3 = text$1(t3_value);
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Model";
    			t7 = space();
    			th1 = element("th");
    			th1.textContent = "logLik";
    			t9 = space();
    			th2 = element("th");
    			th2.textContent = "AIC";
    			t11 = space();
    			th3 = element("th");
    			th3.textContent = "BIC";
    			t13 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$1, 475, 12, 15839);
    			add_location(p, file$1, 476, 12, 15928);
    			attr_dev(th0, "data-key", "Model");
    			add_location(th0, file$1, 485, 20, 16160);
    			attr_dev(th1, "data-key", "Model");
    			add_location(th1, file$1, 486, 20, 16213);
    			attr_dev(th2, "data-key", "Model");
    			add_location(th2, file$1, 487, 20, 16267);
    			attr_dev(th3, "data-key", "Model");
    			add_location(th3, file$1, 488, 20, 16318);
    			add_location(thead, file$1, 484, 16, 16131);
    			add_location(tbody, file$1, 491, 16, 16397);
    			add_location(table, file$1, 483, 12, 16105);
    			attr_dev(div, "class", "phylogenetic_score box svelte-fz2yc6");
    			set_style(div, "margin-top", "15px");
    			set_style(div, "background", "rgb(242,242,242)");
    			set_style(div, "border-radius", "8px");
    			set_style(div, "padding", "10px");
    			add_location(div, file$1, 474, 8, 15699);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(div, t4);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t5);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t7);
    			append_dev(thead, th1);
    			append_dev(thead, t9);
    			append_dev(thead, th2);
    			append_dev(thead, t11);
    			append_dev(thead, th3);
    			append_dev(table, t13);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*passimory*/ 2048 && t3_value !== (t3_value = /*passimory*/ ctx[11][2] + "")) set_data_dev(t3, t3_value);

    			if (/*NNI*/ ctx[15] == "yes") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_11(ctx);
    					if_block.c();
    					if_block.m(div, t5);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*static_genotype_3*/ 16) {
    				each_value_5 = Array(/*static_genotype_3*/ ctx[4]["Model"].length);
    				validate_each_argument(each_value_5);
    				validate_each_keys(ctx, each_value_5, get_each_context_5, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_5, each_1_lookup, tbody, destroy_block, create_each_block_5, null, get_each_context_5);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(472:8) {#if static_genotype_3 != null }",
    		ctx
    	});

    	return block;
    }

    // (480:12) {#if NNI == "yes" }
    function create_if_block_11(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*Repeat_nni*/ ctx[10]['single'] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1("Repeated NNI : ");
    			t1 = text$1(t1_value);
    			add_location(p, file$1, 480, 12, 16020);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*Repeat_nni*/ 1024 && t1_value !== (t1_value = /*Repeat_nni*/ ctx[10]['single'] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(480:12) {#if NNI == \\\"yes\\\" }",
    		ctx
    	});

    	return block;
    }

    // (494:20) {#each Array(static_genotype_3["Model"].length) as _, index (index)}
    function create_each_block_5(key_1, ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*static_genotype_3*/ ctx[4]["Model"][/*index*/ ctx[42]] + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*static_genotype_3*/ ctx[4]["logLik"][/*index*/ ctx[42]] + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*static_genotype_3*/ ctx[4]["AIC"][/*index*/ ctx[42]] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*static_genotype_3*/ ctx[4]["BIC"][/*index*/ ctx[42]] + "";
    	let t6;
    	let t7;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text$1(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text$1(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text$1(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text$1(t6_value);
    			t7 = space();
    			attr_dev(td0, "class", "id svelte-fz2yc6");
    			set_style(td0, "width", "230px");
    			add_location(td0, file$1, 495, 24, 16594);
    			attr_dev(td1, "class", "id svelte-fz2yc6");
    			set_style(td1, "width", "230px");
    			add_location(td1, file$1, 496, 24, 16697);
    			attr_dev(td2, "class", "id svelte-fz2yc6");
    			set_style(td2, "width", "230px");
    			add_location(td2, file$1, 497, 24, 16801);
    			attr_dev(td3, "class", "id svelte-fz2yc6");
    			set_style(td3, "width", "230px");
    			add_location(td3, file$1, 498, 24, 16902);
    			set_style(tr, "border-color", "black");
    			add_location(tr, file$1, 494, 20, 16535);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*static_genotype_3*/ 16 && t0_value !== (t0_value = /*static_genotype_3*/ ctx[4]["Model"][/*index*/ ctx[42]] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*static_genotype_3*/ 16 && t2_value !== (t2_value = /*static_genotype_3*/ ctx[4]["logLik"][/*index*/ ctx[42]] + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*static_genotype_3*/ 16 && t4_value !== (t4_value = /*static_genotype_3*/ ctx[4]["AIC"][/*index*/ ctx[42]] + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*static_genotype_3*/ 16 && t6_value !== (t6_value = /*static_genotype_3*/ ctx[4]["BIC"][/*index*/ ctx[42]] + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(494:20) {#each Array(static_genotype_3[\\\"Model\\\"].length) as _, index (index)}",
    		ctx
    	});

    	return block;
    }

    // (510:8) {#if static_genotype_4 != null }
    function create_if_block_8(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let p;
    	let t2;
    	let t3_value = /*passimory*/ ctx[11][3] + "";
    	let t3;
    	let t4;
    	let t5;
    	let table;
    	let thead;
    	let th0;
    	let t7;
    	let th1;
    	let t9;
    	let th2;
    	let t11;
    	let th3;
    	let t13;
    	let tbody;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let if_block = /*NNI*/ ctx[15] == "yes" && create_if_block_9(ctx);
    	let each_value_4 = Array(/*static_genotype_4*/ ctx[5]["Model"].length);
    	validate_each_argument(each_value_4);
    	const get_key = ctx => /*index*/ ctx[42];
    	validate_each_keys(ctx, each_value_4, get_each_context_4, get_key);

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		let child_ctx = get_each_context_4(ctx, each_value_4, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "genotype based phylogenetic statistics(centroid-linkage clustering)";
    			t1 = space();
    			p = element("p");
    			t2 = text$1("passimory : ");
    			t3 = text$1(t3_value);
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Model";
    			t7 = space();
    			th1 = element("th");
    			th1.textContent = "logLik";
    			t9 = space();
    			th2 = element("th");
    			th2.textContent = "AIC";
    			t11 = space();
    			th3 = element("th");
    			th3.textContent = "BIC";
    			t13 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$1, 512, 12, 17358);
    			add_location(p, file$1, 513, 12, 17448);
    			attr_dev(th0, "data-key", "Model");
    			add_location(th0, file$1, 521, 20, 17674);
    			attr_dev(th1, "data-key", "Model");
    			add_location(th1, file$1, 522, 20, 17727);
    			attr_dev(th2, "data-key", "Model");
    			add_location(th2, file$1, 523, 20, 17781);
    			attr_dev(th3, "data-key", "Model");
    			add_location(th3, file$1, 524, 20, 17832);
    			add_location(thead, file$1, 520, 16, 17645);
    			add_location(tbody, file$1, 527, 16, 17911);
    			add_location(table, file$1, 519, 12, 17619);
    			attr_dev(div, "class", "phylogenetic_score box svelte-fz2yc6");
    			set_style(div, "margin-top", "15px");
    			set_style(div, "background", "rgb(242,242,242)");
    			set_style(div, "border-radius", "8px");
    			set_style(div, "padding", "10px");
    			add_location(div, file$1, 511, 8, 17218);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(div, t4);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t5);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t7);
    			append_dev(thead, th1);
    			append_dev(thead, t9);
    			append_dev(thead, th2);
    			append_dev(thead, t11);
    			append_dev(thead, th3);
    			append_dev(table, t13);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*passimory*/ 2048 && t3_value !== (t3_value = /*passimory*/ ctx[11][3] + "")) set_data_dev(t3, t3_value);

    			if (/*NNI*/ ctx[15] == "yes") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_9(ctx);
    					if_block.c();
    					if_block.m(div, t5);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*static_genotype_4*/ 32) {
    				each_value_4 = Array(/*static_genotype_4*/ ctx[5]["Model"].length);
    				validate_each_argument(each_value_4);
    				validate_each_keys(ctx, each_value_4, get_each_context_4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_4, each_1_lookup, tbody, destroy_block, create_each_block_4, null, get_each_context_4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(510:8) {#if static_genotype_4 != null }",
    		ctx
    	});

    	return block;
    }

    // (516:12) {#if NNI == "yes" }
    function create_if_block_9(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*Repeat_nni*/ ctx[10]['single'] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1("Repeated NNI : ");
    			t1 = text$1(t1_value);
    			add_location(p, file$1, 516, 12, 17534);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*Repeat_nni*/ 1024 && t1_value !== (t1_value = /*Repeat_nni*/ ctx[10]['single'] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(516:12) {#if NNI == \\\"yes\\\" }",
    		ctx
    	});

    	return block;
    }

    // (530:20) {#each Array(static_genotype_4["Model"].length) as _, index (index)}
    function create_each_block_4(key_1, ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*static_genotype_4*/ ctx[5]["Model"][/*index*/ ctx[42]] + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*static_genotype_4*/ ctx[5]["logLik"][/*index*/ ctx[42]] + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*static_genotype_4*/ ctx[5]["AIC"][/*index*/ ctx[42]] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*static_genotype_4*/ ctx[5]["BIC"][/*index*/ ctx[42]] + "";
    	let t6;
    	let t7;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text$1(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text$1(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text$1(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text$1(t6_value);
    			t7 = space();
    			attr_dev(td0, "class", "id svelte-fz2yc6");
    			set_style(td0, "width", "230px");
    			add_location(td0, file$1, 531, 24, 18108);
    			attr_dev(td1, "class", "id svelte-fz2yc6");
    			set_style(td1, "width", "230px");
    			add_location(td1, file$1, 532, 24, 18211);
    			attr_dev(td2, "class", "id svelte-fz2yc6");
    			set_style(td2, "width", "230px");
    			add_location(td2, file$1, 533, 24, 18315);
    			attr_dev(td3, "class", "id svelte-fz2yc6");
    			set_style(td3, "width", "230px");
    			add_location(td3, file$1, 534, 24, 18416);
    			set_style(tr, "border-color", "black");
    			add_location(tr, file$1, 530, 20, 18049);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*static_genotype_4*/ 32 && t0_value !== (t0_value = /*static_genotype_4*/ ctx[5]["Model"][/*index*/ ctx[42]] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*static_genotype_4*/ 32 && t2_value !== (t2_value = /*static_genotype_4*/ ctx[5]["logLik"][/*index*/ ctx[42]] + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*static_genotype_4*/ 32 && t4_value !== (t4_value = /*static_genotype_4*/ ctx[5]["AIC"][/*index*/ ctx[42]] + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*static_genotype_4*/ 32 && t6_value !== (t6_value = /*static_genotype_4*/ ctx[5]["BIC"][/*index*/ ctx[42]] + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(530:20) {#each Array(static_genotype_4[\\\"Model\\\"].length) as _, index (index)}",
    		ctx
    	});

    	return block;
    }

    // (549:8) {#if static_genotype_5 != null }
    function create_if_block_6(ctx) {
    	let t0;
    	let div;
    	let h3;
    	let t2;
    	let p;
    	let t3;
    	let t4_value = /*passimory*/ ctx[11][4] + "";
    	let t4;
    	let t5;
    	let table;
    	let thead;
    	let th0;
    	let t7;
    	let th1;
    	let t9;
    	let th2;
    	let t11;
    	let th3;
    	let t13;
    	let tbody;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let if_block = /*NNI*/ ctx[15] == "yes" && create_if_block_7(ctx);
    	let each_value_3 = Array(/*static_genotype_5*/ ctx[6]["Model"].length);
    	validate_each_argument(each_value_3);
    	const get_key = ctx => /*index*/ ctx[42];
    	validate_each_keys(ctx, each_value_3, get_each_context_3, get_key);

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		let child_ctx = get_each_context_3(ctx, each_value_3, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "genotype based phylogenetic statistics(median-linkage clustering)";
    			t2 = space();
    			p = element("p");
    			t3 = text$1("passimory : ");
    			t4 = text$1(t4_value);
    			t5 = space();
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Model";
    			t7 = space();
    			th1 = element("th");
    			th1.textContent = "logLik";
    			t9 = space();
    			th2 = element("th");
    			th2.textContent = "AIC";
    			t11 = space();
    			th3 = element("th");
    			th3.textContent = "BIC";
    			t13 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$1, 556, 12, 19002);
    			add_location(p, file$1, 557, 12, 19090);
    			attr_dev(th0, "data-key", "Model");
    			add_location(th0, file$1, 561, 20, 19206);
    			attr_dev(th1, "data-key", "Model");
    			add_location(th1, file$1, 562, 20, 19259);
    			attr_dev(th2, "data-key", "Model");
    			add_location(th2, file$1, 563, 20, 19313);
    			attr_dev(th3, "data-key", "Model");
    			add_location(th3, file$1, 564, 20, 19364);
    			add_location(thead, file$1, 560, 16, 19177);
    			add_location(tbody, file$1, 567, 16, 19443);
    			add_location(table, file$1, 559, 12, 19151);
    			attr_dev(div, "class", "phylogenetic_score box svelte-fz2yc6");
    			set_style(div, "margin-top", "15px");
    			set_style(div, "background", "rgb(242,242,242)");
    			set_style(div, "border-radius", "8px");
    			set_style(div, "padding", "10px");
    			add_location(div, file$1, 555, 8, 18862);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t2);
    			append_dev(div, p);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(div, t5);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t7);
    			append_dev(thead, th1);
    			append_dev(thead, t9);
    			append_dev(thead, th2);
    			append_dev(thead, t11);
    			append_dev(thead, th3);
    			append_dev(table, t13);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*NNI*/ ctx[15] == "yes") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_7(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*passimory*/ 2048 && t4_value !== (t4_value = /*passimory*/ ctx[11][4] + "")) set_data_dev(t4, t4_value);

    			if (dirty[0] & /*static_genotype_5*/ 64) {
    				each_value_3 = Array(/*static_genotype_5*/ ctx[6]["Model"].length);
    				validate_each_argument(each_value_3);
    				validate_each_keys(ctx, each_value_3, get_each_context_3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_3, each_1_lookup, tbody, destroy_block, create_each_block_3, null, get_each_context_3);
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(549:8) {#if static_genotype_5 != null }",
    		ctx
    	});

    	return block;
    }

    // (551:8) {#if NNI == "yes" }
    function create_if_block_7(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*Repeat_nni*/ ctx[10]['single'] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1("Repeated NNI : ");
    			t1 = text$1(t1_value);
    			add_location(p, file$1, 551, 8, 18779);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*Repeat_nni*/ 1024 && t1_value !== (t1_value = /*Repeat_nni*/ ctx[10]['single'] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(551:8) {#if NNI == \\\"yes\\\" }",
    		ctx
    	});

    	return block;
    }

    // (570:20) {#each Array(static_genotype_5["Model"].length) as _, index (index)}
    function create_each_block_3(key_1, ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*static_genotype_5*/ ctx[6]["Model"][/*index*/ ctx[42]] + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*static_genotype_5*/ ctx[6]["logLik"][/*index*/ ctx[42]] + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*static_genotype_5*/ ctx[6]["AIC"][/*index*/ ctx[42]] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*static_genotype_5*/ ctx[6]["BIC"][/*index*/ ctx[42]] + "";
    	let t6;
    	let t7;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text$1(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text$1(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text$1(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text$1(t6_value);
    			t7 = space();
    			attr_dev(td0, "class", "id svelte-fz2yc6");
    			set_style(td0, "width", "230px");
    			add_location(td0, file$1, 571, 24, 19640);
    			attr_dev(td1, "class", "id svelte-fz2yc6");
    			set_style(td1, "width", "230px");
    			add_location(td1, file$1, 572, 24, 19743);
    			attr_dev(td2, "class", "id svelte-fz2yc6");
    			set_style(td2, "width", "230px");
    			add_location(td2, file$1, 573, 24, 19847);
    			attr_dev(td3, "class", "id svelte-fz2yc6");
    			set_style(td3, "width", "230px");
    			add_location(td3, file$1, 574, 24, 19948);
    			set_style(tr, "border-color", "black");
    			add_location(tr, file$1, 570, 20, 19581);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*static_genotype_5*/ 64 && t0_value !== (t0_value = /*static_genotype_5*/ ctx[6]["Model"][/*index*/ ctx[42]] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*static_genotype_5*/ 64 && t2_value !== (t2_value = /*static_genotype_5*/ ctx[6]["logLik"][/*index*/ ctx[42]] + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*static_genotype_5*/ 64 && t4_value !== (t4_value = /*static_genotype_5*/ ctx[6]["AIC"][/*index*/ ctx[42]] + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*static_genotype_5*/ 64 && t6_value !== (t6_value = /*static_genotype_5*/ ctx[6]["BIC"][/*index*/ ctx[42]] + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(570:20) {#each Array(static_genotype_5[\\\"Model\\\"].length) as _, index (index)}",
    		ctx
    	});

    	return block;
    }

    // (589:8) {#if static_genotype_6 != null }
    function create_if_block_4(ctx) {
    	let t0;
    	let div;
    	let h3;
    	let t2;
    	let p;
    	let t3;
    	let t4_value = /*passimory*/ ctx[11][5] + "";
    	let t4;
    	let t5;
    	let table;
    	let thead;
    	let th0;
    	let t7;
    	let th1;
    	let t9;
    	let th2;
    	let t11;
    	let th3;
    	let t13;
    	let tbody;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let if_block = /*NNI*/ ctx[15] == "yes" && create_if_block_5(ctx);
    	let each_value_2 = Array(/*static_genotype_6*/ ctx[7]["Model"].length);
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*index*/ ctx[42];
    	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "genotype based phylogenetic statistics(ward-linkage clustering)";
    			t2 = space();
    			p = element("p");
    			t3 = text$1("passimory: ");
    			t4 = text$1(t4_value);
    			t5 = space();
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Model";
    			t7 = space();
    			th1 = element("th");
    			th1.textContent = "logLik";
    			t9 = space();
    			th2 = element("th");
    			th2.textContent = "AIC";
    			t11 = space();
    			th3 = element("th");
    			th3.textContent = "BIC";
    			t13 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$1, 596, 12, 20534);
    			add_location(p, file$1, 597, 12, 20620);
    			attr_dev(th0, "data-key", "Model");
    			add_location(th0, file$1, 600, 20, 20721);
    			attr_dev(th1, "data-key", "Model");
    			add_location(th1, file$1, 601, 20, 20774);
    			attr_dev(th2, "data-key", "Model");
    			add_location(th2, file$1, 602, 20, 20828);
    			attr_dev(th3, "data-key", "Model");
    			add_location(th3, file$1, 603, 20, 20879);
    			add_location(thead, file$1, 599, 16, 20692);
    			add_location(tbody, file$1, 606, 16, 20958);
    			add_location(table, file$1, 598, 12, 20666);
    			attr_dev(div, "class", "phylogenetic_score box svelte-fz2yc6");
    			set_style(div, "margin-top", "15px");
    			set_style(div, "background", "rgb(242,242,242)");
    			set_style(div, "border-radius", "8px");
    			set_style(div, "padding", "10px");
    			add_location(div, file$1, 595, 8, 20394);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t2);
    			append_dev(div, p);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(div, t5);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t7);
    			append_dev(thead, th1);
    			append_dev(thead, t9);
    			append_dev(thead, th2);
    			append_dev(thead, t11);
    			append_dev(thead, th3);
    			append_dev(table, t13);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*NNI*/ ctx[15] == "yes") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*passimory*/ 2048 && t4_value !== (t4_value = /*passimory*/ ctx[11][5] + "")) set_data_dev(t4, t4_value);

    			if (dirty[0] & /*static_genotype_6*/ 128) {
    				each_value_2 = Array(/*static_genotype_6*/ ctx[7]["Model"].length);
    				validate_each_argument(each_value_2);
    				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, tbody, destroy_block, create_each_block_2, null, get_each_context_2);
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(589:8) {#if static_genotype_6 != null }",
    		ctx
    	});

    	return block;
    }

    // (591:8) {#if NNI == "yes" }
    function create_if_block_5(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*Repeat_nni*/ ctx[10]['single'] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1("Repeated NNI : ");
    			t1 = text$1(t1_value);
    			add_location(p, file$1, 591, 8, 20311);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*Repeat_nni*/ 1024 && t1_value !== (t1_value = /*Repeat_nni*/ ctx[10]['single'] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(591:8) {#if NNI == \\\"yes\\\" }",
    		ctx
    	});

    	return block;
    }

    // (609:20) {#each Array(static_genotype_6["Model"].length) as _, index (index)}
    function create_each_block_2(key_1, ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*static_genotype_6*/ ctx[7]["Model"][/*index*/ ctx[42]] + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*static_genotype_6*/ ctx[7]["logLik"][/*index*/ ctx[42]] + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*static_genotype_6*/ ctx[7]["AIC"][/*index*/ ctx[42]] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*static_genotype_6*/ ctx[7]["BIC"][/*index*/ ctx[42]] + "";
    	let t6;
    	let t7;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text$1(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text$1(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text$1(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text$1(t6_value);
    			t7 = space();
    			attr_dev(td0, "class", "id svelte-fz2yc6");
    			set_style(td0, "width", "230px");
    			add_location(td0, file$1, 610, 24, 21155);
    			attr_dev(td1, "class", "id svelte-fz2yc6");
    			set_style(td1, "width", "230px");
    			add_location(td1, file$1, 611, 24, 21258);
    			attr_dev(td2, "class", "id svelte-fz2yc6");
    			set_style(td2, "width", "230px");
    			add_location(td2, file$1, 612, 24, 21362);
    			attr_dev(td3, "class", "id svelte-fz2yc6");
    			set_style(td3, "width", "230px");
    			add_location(td3, file$1, 613, 24, 21463);
    			set_style(tr, "border-color", "black");
    			add_location(tr, file$1, 609, 20, 21096);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*static_genotype_6*/ 128 && t0_value !== (t0_value = /*static_genotype_6*/ ctx[7]["Model"][/*index*/ ctx[42]] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*static_genotype_6*/ 128 && t2_value !== (t2_value = /*static_genotype_6*/ ctx[7]["logLik"][/*index*/ ctx[42]] + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*static_genotype_6*/ 128 && t4_value !== (t4_value = /*static_genotype_6*/ ctx[7]["AIC"][/*index*/ ctx[42]] + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*static_genotype_6*/ 128 && t6_value !== (t6_value = /*static_genotype_6*/ ctx[7]["BIC"][/*index*/ ctx[42]] + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(609:20) {#each Array(static_genotype_6[\\\"Model\\\"].length) as _, index (index)}",
    		ctx
    	});

    	return block;
    }

    // (627:8) {#if static_sequence != null }
    function create_if_block_2(ctx) {
    	let t0;
    	let div;
    	let h3;
    	let t2;
    	let p0;
    	let t3;
    	let t4_value = /*passimory*/ ctx[11][6] + "";
    	let t4;
    	let t5;
    	let p1;
    	let t6;
    	let t7_value = /*running_time*/ ctx[12]['sequencetype'] + "";
    	let t7;
    	let t8;
    	let t9;
    	let table;
    	let thead;
    	let th0;
    	let t11;
    	let th1;
    	let t13;
    	let th2;
    	let t15;
    	let th3;
    	let t17;
    	let tbody;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let if_block = /*NNI*/ ctx[15] == "yes" && create_if_block_3(ctx);
    	let each_value_1 = Array(/*static_sequence*/ ctx[19]["Model"].length);
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*index*/ ctx[42];
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "sequence based phylogenetic statistics";
    			t2 = space();
    			p0 = element("p");
    			t3 = text$1("passimory : ");
    			t4 = text$1(t4_value);
    			t5 = space();
    			p1 = element("p");
    			t6 = text$1("running time : ");
    			t7 = text$1(t7_value);
    			t8 = text$1(" sec.");
    			t9 = space();
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Model";
    			t11 = space();
    			th1 = element("th");
    			th1.textContent = "logLik";
    			t13 = space();
    			th2 = element("th");
    			th2.textContent = "AIC";
    			t15 = space();
    			th3 = element("th");
    			th3.textContent = "BIC";
    			t17 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$1, 634, 12, 22041);
    			add_location(p0, file$1, 635, 12, 22102);
    			add_location(p1, file$1, 636, 12, 22149);
    			attr_dev(th0, "data-key", "Model");
    			add_location(th0, file$1, 639, 20, 22276);
    			attr_dev(th1, "data-key", "Model");
    			add_location(th1, file$1, 640, 20, 22329);
    			attr_dev(th2, "data-key", "Model");
    			add_location(th2, file$1, 641, 20, 22383);
    			attr_dev(th3, "data-key", "Model");
    			add_location(th3, file$1, 642, 20, 22434);
    			add_location(thead, file$1, 638, 16, 22247);
    			add_location(tbody, file$1, 645, 16, 22513);
    			add_location(table, file$1, 637, 12, 22221);
    			attr_dev(div, "class", "phylogenetic_score box svelte-fz2yc6");
    			set_style(div, "margin-top", "15px");
    			set_style(div, "background", "rgb(242,242,242)");
    			set_style(div, "border-radius", "8px");
    			set_style(div, "padding", "10px");
    			add_location(div, file$1, 633, 8, 21901);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t2);
    			append_dev(div, p0);
    			append_dev(p0, t3);
    			append_dev(p0, t4);
    			append_dev(div, t5);
    			append_dev(div, p1);
    			append_dev(p1, t6);
    			append_dev(p1, t7);
    			append_dev(p1, t8);
    			append_dev(div, t9);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t11);
    			append_dev(thead, th1);
    			append_dev(thead, t13);
    			append_dev(thead, th2);
    			append_dev(thead, t15);
    			append_dev(thead, th3);
    			append_dev(table, t17);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*NNI*/ ctx[15] == "yes") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*passimory*/ 2048 && t4_value !== (t4_value = /*passimory*/ ctx[11][6] + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*running_time*/ 4096 && t7_value !== (t7_value = /*running_time*/ ctx[12]['sequencetype'] + "")) set_data_dev(t7, t7_value);

    			if (dirty[0] & /*static_sequence*/ 524288) {
    				each_value_1 = Array(/*static_sequence*/ ctx[19]["Model"].length);
    				validate_each_argument(each_value_1);
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, tbody, destroy_block, create_each_block_1, null, get_each_context_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(627:8) {#if static_sequence != null }",
    		ctx
    	});

    	return block;
    }

    // (629:8) {#if NNI == "yes" }
    function create_if_block_3(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*Repeat_nni*/ ctx[10]['single'] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1("Repeated NNI : ");
    			t1 = text$1(t1_value);
    			add_location(p, file$1, 629, 8, 21818);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*Repeat_nni*/ 1024 && t1_value !== (t1_value = /*Repeat_nni*/ ctx[10]['single'] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(629:8) {#if NNI == \\\"yes\\\" }",
    		ctx
    	});

    	return block;
    }

    // (648:20) {#each Array(static_sequence["Model"].length) as _, index (index)}
    function create_each_block_1(key_1, ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*static_sequence*/ ctx[19]["Model"][/*index*/ ctx[42]] + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*static_sequence*/ ctx[19]["logLik"][/*index*/ ctx[42]] + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*static_sequence*/ ctx[19]["AIC"][/*index*/ ctx[42]] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*static_sequence*/ ctx[19]["BIC"][/*index*/ ctx[42]] + "";
    	let t6;
    	let t7;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text$1(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text$1(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text$1(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text$1(t6_value);
    			t7 = space();
    			attr_dev(td0, "class", "id svelte-fz2yc6");
    			set_style(td0, "width", "230px");
    			add_location(td0, file$1, 649, 24, 22708);
    			attr_dev(td1, "class", "id svelte-fz2yc6");
    			set_style(td1, "width", "230px");
    			add_location(td1, file$1, 650, 24, 22809);
    			attr_dev(td2, "class", "id svelte-fz2yc6");
    			set_style(td2, "width", "230px");
    			add_location(td2, file$1, 651, 24, 22911);
    			attr_dev(td3, "class", "id svelte-fz2yc6");
    			set_style(td3, "width", "230px");
    			add_location(td3, file$1, 652, 24, 23010);
    			set_style(tr, "border-color", "black");
    			add_location(tr, file$1, 648, 20, 22649);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(648:20) {#each Array(static_sequence[\\\"Model\\\"].length) as _, index (index)}",
    		ctx
    	});

    	return block;
    }

    // (667:8) {#if phangorn_upgma != null }
    function create_if_block(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let p0;
    	let t2;
    	let t3_value = /*passimory*/ ctx[11][7] + "";
    	let t3;
    	let t4;
    	let p1;
    	let t5;
    	let t6_value = /*running_time*/ ctx[12]['phangorn'] + "";
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let table;
    	let thead;
    	let th0;
    	let t11;
    	let th1;
    	let t13;
    	let th2;
    	let t15;
    	let th3;
    	let t17;
    	let tbody;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let if_block = /*NNI*/ ctx[15] == "yes" && create_if_block_1(ctx);
    	let each_value = Array(/*phangorn_upgma*/ ctx[8]["Model"].length);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*index*/ ctx[42];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "sequence based phylogenetic statistics(library(phangorn) )";
    			t1 = space();
    			p0 = element("p");
    			t2 = text$1("passimory : ");
    			t3 = text$1(t3_value);
    			t4 = space();
    			p1 = element("p");
    			t5 = text$1("running time : ");
    			t6 = text$1(t6_value);
    			t7 = text$1(" sec.");
    			t8 = space();
    			if (if_block) if_block.c();
    			t9 = space();
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Model";
    			t11 = space();
    			th1 = element("th");
    			th1.textContent = "logLik";
    			t13 = space();
    			th2 = element("th");
    			th2.textContent = "AIC";
    			t15 = space();
    			th3 = element("th");
    			th3.textContent = "BIC";
    			t17 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$1, 670, 12, 23485);
    			add_location(p0, file$1, 671, 12, 23566);
    			add_location(p1, file$1, 672, 12, 23613);
    			attr_dev(th0, "data-key", "Model");
    			add_location(th0, file$1, 680, 20, 23867);
    			attr_dev(th1, "data-key", "Model");
    			add_location(th1, file$1, 681, 20, 23920);
    			attr_dev(th2, "data-key", "Model");
    			add_location(th2, file$1, 682, 20, 23974);
    			attr_dev(th3, "data-key", "Model");
    			add_location(th3, file$1, 683, 20, 24025);
    			add_location(thead, file$1, 679, 16, 23838);
    			add_location(tbody, file$1, 686, 16, 24104);
    			add_location(table, file$1, 678, 12, 23812);
    			attr_dev(div, "class", "phylogenetic_score box svelte-fz2yc6");
    			set_style(div, "margin-top", "15px");
    			set_style(div, "background", "rgb(242,242,242)");
    			set_style(div, "border-radius", "8px");
    			set_style(div, "padding", "10px");
    			add_location(div, file$1, 669, 8, 23345);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, t3);
    			append_dev(div, t4);
    			append_dev(div, p1);
    			append_dev(p1, t5);
    			append_dev(p1, t6);
    			append_dev(p1, t7);
    			append_dev(div, t8);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t9);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t11);
    			append_dev(thead, th1);
    			append_dev(thead, t13);
    			append_dev(thead, th2);
    			append_dev(thead, t15);
    			append_dev(thead, th3);
    			append_dev(table, t17);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*passimory*/ 2048 && t3_value !== (t3_value = /*passimory*/ ctx[11][7] + "")) set_data_dev(t3, t3_value);
    			if (dirty[0] & /*running_time*/ 4096 && t6_value !== (t6_value = /*running_time*/ ctx[12]['phangorn'] + "")) set_data_dev(t6, t6_value);

    			if (/*NNI*/ ctx[15] == "yes") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div, t9);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*phangorn_upgma*/ 256) {
    				each_value = Array(/*phangorn_upgma*/ ctx[8]["Model"].length);
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, tbody, destroy_block, create_each_block, null, get_each_context);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(667:8) {#if phangorn_upgma != null }",
    		ctx
    	});

    	return block;
    }

    // (675:12) {#if NNI == "yes" }
    function create_if_block_1(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*Repeat_nni*/ ctx[10]['single'] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text$1("Repeated NNI : ");
    			t1 = text$1(t1_value);
    			add_location(p, file$1, 675, 12, 23720);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*Repeat_nni*/ 1024 && t1_value !== (t1_value = /*Repeat_nni*/ ctx[10]['single'] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(675:12) {#if NNI == \\\"yes\\\" }",
    		ctx
    	});

    	return block;
    }

    // (689:20) {#each Array(phangorn_upgma["Model"].length) as _, index (index)}
    function create_each_block(key_1, ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*phangorn_upgma*/ ctx[8]["Model"][/*index*/ ctx[42]] + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*phangorn_upgma*/ ctx[8]["logLik"][/*index*/ ctx[42]] + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*phangorn_upgma*/ ctx[8]["AIC"][/*index*/ ctx[42]] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*phangorn_upgma*/ ctx[8]["BIC"][/*index*/ ctx[42]] + "";
    	let t6;
    	let t7;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text$1(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text$1(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text$1(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text$1(t6_value);
    			t7 = space();
    			attr_dev(td0, "class", "id svelte-fz2yc6");
    			set_style(td0, "width", "230px");
    			add_location(td0, file$1, 690, 24, 24298);
    			attr_dev(td1, "class", "id svelte-fz2yc6");
    			set_style(td1, "width", "230px");
    			add_location(td1, file$1, 691, 24, 24398);
    			attr_dev(td2, "class", "id svelte-fz2yc6");
    			set_style(td2, "width", "230px");
    			add_location(td2, file$1, 692, 24, 24499);
    			attr_dev(td3, "class", "id svelte-fz2yc6");
    			set_style(td3, "width", "230px");
    			add_location(td3, file$1, 693, 24, 24597);
    			set_style(tr, "border-color", "black");
    			add_location(tr, file$1, 689, 20, 24239);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*phangorn_upgma*/ 256 && t0_value !== (t0_value = /*phangorn_upgma*/ ctx[8]["Model"][/*index*/ ctx[42]] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*phangorn_upgma*/ 256 && t2_value !== (t2_value = /*phangorn_upgma*/ ctx[8]["logLik"][/*index*/ ctx[42]] + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*phangorn_upgma*/ 256 && t4_value !== (t4_value = /*phangorn_upgma*/ ctx[8]["AIC"][/*index*/ ctx[42]] + "")) set_data_dev(t4, t4_value);
    			if (dirty[0] & /*phangorn_upgma*/ 256 && t6_value !== (t6_value = /*phangorn_upgma*/ ctx[8]["BIC"][/*index*/ ctx[42]] + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(689:20) {#each Array(phangorn_upgma[\\\"Model\\\"].length) as _, index (index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div9;
    	let div0;
    	let t0;
    	let div1;
    	let select0;
    	let t1;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let td;
    	let a;
    	let t9;
    	let div2;
    	let label2;
    	let t11;
    	let select1;
    	let option0;
    	let option1;
    	let t14;
    	let div3;
    	let label3;
    	let t16;
    	let select2;
    	let option2;
    	let option3;
    	let option4;
    	let t20;
    	let div4;
    	let label4;
    	let t22;
    	let select3;
    	let option5;
    	let option6;
    	let t25;
    	let div5;
    	let label5;
    	let t27;
    	let select4;
    	let option7;
    	let option8;
    	let t30;
    	let div6;
    	let label6;
    	let t32;
    	let select5;
    	let option9;
    	let option10;
    	let t35;
    	let div7;
    	let p;
    	let t36;
    	let t37;
    	let t38;
    	let t39;
    	let t40;
    	let t41;
    	let t42;
    	let t43;
    	let t44;
    	let t45;
    	let t46;
    	let div8;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*result*/ ctx[1] !== null && create_if_block_16(ctx);
    	let each_value_8 = /*chromosomes*/ ctx[16];
    	validate_each_argument(each_value_8);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_8.length; i += 1) {
    		each_blocks[i] = create_each_block_8(get_each_context_8(ctx, each_value_8, i));
    	}

    	let if_block1 = /*static_genotype_1*/ ctx[2] != null && create_if_block_14(ctx);
    	let if_block2 = /*static_genotype_2*/ ctx[3] != null && create_if_block_12(ctx);
    	let if_block3 = /*static_genotype_3*/ ctx[4] != null && create_if_block_10(ctx);
    	let if_block4 = /*static_genotype_4*/ ctx[5] != null && create_if_block_8(ctx);
    	let if_block5 = /*static_genotype_5*/ ctx[6] != null && create_if_block_6(ctx);
    	let if_block6 = /*static_genotype_6*/ ctx[7] != null && create_if_block_4(ctx);
    	let if_block7 = /*static_sequence*/ ctx[19] != null && create_if_block_2(ctx);
    	let if_block8 = /*phangorn_upgma*/ ctx[8] != null && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			select0 = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			label0 = element("label");
    			label0.textContent = "starting postion";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			label1 = element("label");
    			label1.textContent = "end postion";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			td = element("td");
    			a = element("a");
    			a.textContent = "show";
    			t9 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "select the data file:";
    			t11 = space();
    			select1 = element("select");
    			option0 = element("option");
    			option0.textContent = "VCF file only (SNP)";
    			option1 = element("option");
    			option1.textContent = "Entire sequence";
    			t14 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = "select the alles:";
    			t16 = space();
    			select2 = element("select");
    			option2 = element("option");
    			option2.textContent = "IUPAC code for all genotypes";
    			option3 = element("option");
    			option3.textContent = "the first allele";
    			option4 = element("option");
    			option4.textContent = "the second allele";
    			t20 = space();
    			div4 = element("div");
    			label4 = element("label");
    			label4.textContent = "Nearest Neighbour Interchange:";
    			t22 = space();
    			select3 = element("select");
    			option5 = element("option");
    			option5.textContent = "False";
    			option6 = element("option");
    			option6.textContent = "True";
    			t25 = space();
    			div5 = element("div");
    			label5 = element("label");
    			label5.textContent = "optimization parameters(NNI):";
    			t27 = space();
    			select4 = element("select");
    			option7 = element("option");
    			option7.textContent = "parsimony ";
    			option8 = element("option");
    			option8.textContent = "maximum likelihood";
    			t30 = space();
    			div6 = element("div");
    			label6 = element("label");
    			label6.textContent = "substitution model:";
    			t32 = space();
    			select5 = element("select");
    			option9 = element("option");
    			option9.textContent = "Jukes and Cantor (1969)";
    			option10 = element("option");
    			option10.textContent = "Kimura (1980)";
    			t35 = space();
    			div7 = element("div");
    			p = element("p");
    			t36 = text$1("Number oF Variants  : ");
    			t37 = text$1(/*no_of_variants*/ ctx[9]);
    			t38 = space();
    			if (if_block1) if_block1.c();
    			t39 = space();
    			if (if_block2) if_block2.c();
    			t40 = space();
    			if (if_block3) if_block3.c();
    			t41 = space();
    			if (if_block4) if_block4.c();
    			t42 = space();
    			if (if_block5) if_block5.c();
    			t43 = space();
    			if (if_block6) if_block6.c();
    			t44 = space();
    			if (if_block7) if_block7.c();
    			t45 = space();
    			if (if_block8) if_block8.c();
    			t46 = space();
    			div8 = element("div");
    			set_style(div0, "min-height", "600px");
    			add_location(div0, file$1, 257, 4, 7930);
    			if (/*select_chromosome*/ ctx[17] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[26].call(select0));
    			add_location(select0, file$1, 312, 8, 10106);
    			add_location(label0, file$1, 321, 8, 10395);
    			attr_dev(input0, "name", "startpos");
    			add_location(input0, file$1, 321, 41, 10428);
    			add_location(label1, file$1, 322, 8, 10486);
    			attr_dev(input1, "name", "endpos");
    			add_location(input1, file$1, 322, 36, 10514);
    			attr_dev(a, "href", "#");
    			add_location(a, file$1, 324, 12, 10578);
    			add_location(td, file$1, 324, 8, 10574);
    			attr_dev(div1, "class", "context1 svelte-fz2yc6");
    			add_location(div1, file$1, 310, 4, 10068);
    			attr_dev(label2, "for", "data_file");
    			add_location(label2, file$1, 331, 12, 10746);
    			option0.__value = "VCF_file_only";
    			option0.value = option0.__value;
    			add_location(option0, file$1, 334, 14, 10874);
    			option1.__value = "Entire sequence";
    			option1.value = option1.__value;
    			add_location(option1, file$1, 335, 14, 10948);
    			attr_dev(select1, "name", "data_file");
    			attr_dev(select1, "id", "data_file");
    			add_location(select1, file$1, 333, 12, 10818);
    			add_location(div2, file$1, 330, 8, 10727);
    			attr_dev(label3, "for", "consensus ");
    			add_location(label3, file$1, 341, 12, 11084);
    			option2.__value = "I";
    			option2.value = option2.__value;
    			add_location(option2, file$1, 344, 14, 11210);
    			option3.__value = "R";
    			option3.value = option3.__value;
    			add_location(option3, file$1, 345, 14, 11281);
    			option4.__value = "A";
    			option4.value = option4.__value;
    			add_location(option4, file$1, 346, 14, 11340);
    			attr_dev(select2, "name", "consensus ");
    			attr_dev(select2, "id", "consensus");
    			add_location(select2, file$1, 343, 12, 11153);
    			add_location(div3, file$1, 340, 8, 11065);
    			attr_dev(label4, "for", "nni ");
    			add_location(label4, file$1, 352, 12, 11464);
    			option5.__value = "no";
    			option5.value = option5.__value;
    			add_location(option5, file$1, 355, 12, 11583);
    			option6.__value = "yes";
    			option6.value = option6.__value;
    			add_location(option6, file$1, 356, 12, 11630);
    			attr_dev(select3, "name", "nni ");
    			attr_dev(select3, "id", "nni");
    			add_location(select3, file$1, 354, 12, 11540);
    			add_location(div4, file$1, 351, 8, 11445);
    			attr_dev(label5, "for", "nni ");
    			add_location(label5, file$1, 363, 12, 11749);
    			option7.__value = "parsimony";
    			option7.value = option7.__value;
    			add_location(option7, file$1, 366, 12, 11879);
    			option8.__value = "maximum_likelihood";
    			option8.value = option8.__value;
    			add_location(option8, file$1, 367, 12, 11938);
    			attr_dev(select4, "name", "opt_param ");
    			attr_dev(select4, "id", "opt_param");
    			add_location(select4, file$1, 365, 12, 11824);
    			add_location(div5, file$1, 362, 8, 11730);
    			attr_dev(label6, "for", "nni ");
    			add_location(label6, file$1, 374, 12, 12086);
    			option9.__value = "JC";
    			option9.value = option9.__value;
    			add_location(option9, file$1, 377, 12, 12208);
    			option10.__value = "K80";
    			option10.value = option10.__value;
    			add_location(option10, file$1, 378, 12, 12273);
    			attr_dev(select5, "name", "subs_model ");
    			attr_dev(select5, "id", "subs_model");
    			add_location(select5, file$1, 376, 12, 12151);
    			add_location(div6, file$1, 373, 8, 12067);
    			add_location(p, file$1, 385, 12, 12401);
    			add_location(div7, file$1, 384, 8, 12382);
    			attr_dev(div8, "id", "phylogenetic_graph");
    			add_location(div8, file$1, 712, 8, 24914);
    			add_location(div9, file$1, 255, 4, 7912);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div9, t0);
    			append_dev(div9, div1);
    			append_dev(div1, select0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select0, null);
    			}

    			select_option(select0, /*select_chromosome*/ ctx[17]);
    			append_dev(div1, t1);
    			append_dev(div1, label0);
    			append_dev(div1, t3);
    			append_dev(div1, input0);
    			set_input_value(input0, /*start*/ ctx[13]);
    			append_dev(div1, t4);
    			append_dev(div1, label1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			set_input_value(input1, /*end*/ ctx[14]);
    			append_dev(div1, t7);
    			append_dev(div1, td);
    			append_dev(td, a);
    			append_dev(div9, t9);
    			append_dev(div9, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t11);
    			append_dev(div2, select1);
    			append_dev(select1, option0);
    			append_dev(select1, option1);
    			append_dev(div9, t14);
    			append_dev(div9, div3);
    			append_dev(div3, label3);
    			append_dev(div3, t16);
    			append_dev(div3, select2);
    			append_dev(select2, option2);
    			append_dev(select2, option3);
    			append_dev(select2, option4);
    			append_dev(div9, t20);
    			append_dev(div9, div4);
    			append_dev(div4, label4);
    			append_dev(div4, t22);
    			append_dev(div4, select3);
    			append_dev(select3, option5);
    			append_dev(select3, option6);
    			append_dev(div9, t25);
    			append_dev(div9, div5);
    			append_dev(div5, label5);
    			append_dev(div5, t27);
    			append_dev(div5, select4);
    			append_dev(select4, option7);
    			append_dev(select4, option8);
    			append_dev(div9, t30);
    			append_dev(div9, div6);
    			append_dev(div6, label6);
    			append_dev(div6, t32);
    			append_dev(div6, select5);
    			append_dev(select5, option9);
    			append_dev(select5, option10);
    			append_dev(div9, t35);
    			append_dev(div9, div7);
    			append_dev(div7, p);
    			append_dev(p, t36);
    			append_dev(p, t37);
    			append_dev(div9, t38);
    			if (if_block1) if_block1.m(div9, null);
    			append_dev(div9, t39);
    			if (if_block2) if_block2.m(div9, null);
    			append_dev(div9, t40);
    			if (if_block3) if_block3.m(div9, null);
    			append_dev(div9, t41);
    			if (if_block4) if_block4.m(div9, null);
    			append_dev(div9, t42);
    			if (if_block5) if_block5.m(div9, null);
    			append_dev(div9, t43);
    			if (if_block6) if_block6.m(div9, null);
    			append_dev(div9, t44);
    			if (if_block7) if_block7.m(div9, null);
    			append_dev(div9, t45);
    			if (if_block8) if_block8.m(div9, null);
    			append_dev(div9, t46);
    			append_dev(div9, div8);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[26]),
    					listen_dev(select0, "change", /*change_chromosome*/ ctx[21], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[27]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[28]),
    					listen_dev(a, "click", prevent_default(/*click_handler_1*/ ctx[29]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*result*/ ctx[1] !== null) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*result*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_16(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*chromosomes*/ 65536) {
    				each_value_8 = /*chromosomes*/ ctx[16];
    				validate_each_argument(each_value_8);
    				let i;

    				for (i = 0; i < each_value_8.length; i += 1) {
    					const child_ctx = get_each_context_8(ctx, each_value_8, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_8.length;
    			}

    			if (dirty[0] & /*select_chromosome, chromosomes*/ 196608) {
    				select_option(select0, /*select_chromosome*/ ctx[17]);
    			}

    			if (dirty[0] & /*start*/ 8192 && input0.value !== /*start*/ ctx[13]) {
    				set_input_value(input0, /*start*/ ctx[13]);
    			}

    			if (dirty[0] & /*end*/ 16384 && input1.value !== /*end*/ ctx[14]) {
    				set_input_value(input1, /*end*/ ctx[14]);
    			}

    			if (!current || dirty[0] & /*no_of_variants*/ 512) set_data_dev(t37, /*no_of_variants*/ ctx[9]);

    			if (/*static_genotype_1*/ ctx[2] != null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_14(ctx);
    					if_block1.c();
    					if_block1.m(div9, t39);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*static_genotype_2*/ ctx[3] != null) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_12(ctx);
    					if_block2.c();
    					if_block2.m(div9, t40);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*static_genotype_3*/ ctx[4] != null) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_10(ctx);
    					if_block3.c();
    					if_block3.m(div9, t41);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*static_genotype_4*/ ctx[5] != null) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_8(ctx);
    					if_block4.c();
    					if_block4.m(div9, t42);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*static_genotype_5*/ ctx[6] != null) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_6(ctx);
    					if_block5.c();
    					if_block5.m(div9, t43);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*static_genotype_6*/ ctx[7] != null) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_4(ctx);
    					if_block6.c();
    					if_block6.m(div9, t44);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*static_sequence*/ ctx[19] != null) if_block7.p(ctx, dirty);

    			if (/*phangorn_upgma*/ ctx[8] != null) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block(ctx);
    					if_block8.c();
    					if_block8.m(div9, t46);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function highlighted_sample_list(data) {
    	if (highlighted_sample.indexOf(data) > -1 == true) {
    		console.log("exit");
    	} else {
    		console.log(data);
    		highlighted_sample.push(data);
    		const my_id = 're' + ' ' + data;
    		document.getElementById("highlighted_samples").innerHTML += '<button   id=' + my_id + '  type="button" class="divbrowse-btn divbrowse-btn-light" style="float: left; margin: 0px 5px 7px 0px; " >' + data + '</button>';
    		console.log(highlighted_sample);
    	}
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $rows,
    		$$unsubscribe_rows = noop$3,
    		$$subscribe_rows = () => ($$unsubscribe_rows(), $$unsubscribe_rows = subscribe(rows, $$value => $$invalidate(18, $rows = $$value)), rows);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_rows());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Vcftophylogenetic', slots, []);
    	const context = getContext('app');
    	let rows;
    	let result;
    	let static_genotype_1;
    	let static_genotype_2;
    	let static_genotype_3;
    	let static_genotype_4;
    	let static_genotype_5;
    	let static_genotype_6;
    	let static_sequence;
    	let phangorn_upgma;
    	let no_of_variants;
    	let static_vcf_data;
    	let Repeat_nni;
    	let _dataframe;
    	let samples = null;
    	let likelihood = [];
    	let passimory = [];
    	let running_time = [];
    	let start;
    	let end;
    	let selectElement;
    	let consensus;
    	let data_file;
    	let NNI;
    	let subs_model;
    	let opt_param;
    	let chromosomes = [];
    	let chromosome = null;
    	let select_chromosome;

    	onMount(async () => {
    		let url_genes = 'http://127.0.0.1:8090' + '/genes';

    		axios$1.get(url_genes).then(response => {
    			_dataframe = new DataFrame(response.data.genes.data, response.data.genes.columns);
    			$$invalidate(1, result = _dataframe.toCollection());
    		}).catch(error => {
    			console.log(error);
    			this.raiseError('Error: Could not load genes data from the server / backend.');
    		});

    		let url_samples = 'http://127.0.0.1:8090' + '/samples';

    		axios$1.get(url_samples).then(response => {
    			samples = response.data;
    		}).catch(error => {
    			console.log(error);
    			this.raiseError('Error: Could not load genes data from the server / backend.');
    		});

    		let url_chromosomes = 'http://127.0.0.1:8090' + '/chromosomes';

    		axios$1.get(url_chromosomes).then(response => {
    			$$invalidate(16, chromosomes = response.data);
    			$$invalidate(17, select_chromosome = response.data[0]);
    			console.log(chromosomes);
    			console.log(select_chromosome);
    			console.log(response.data[0]["end"]);
    			console.log(response.data[0]["start"]);
    			$$invalidate(13, start = response.data[0]["start"]);
    			$$invalidate(14, end = response.data[0]["end"]);
    		}).catch(error => {
    			console.log(error);
    			this.raiseError('Error: Could not load genes data from the server / backend.');
    		});

    		let url_configuration = 'http://127.0.0.1:8090' + '/configuration';

    		axios$1.get(url_configuration).then(response => {
    			
    		}).catch(error => {
    			console.log(error);
    			this.raiseError('Error: Could not load genes data from the server / backend.');
    		});
    	});

    	const datatableSettings = {
    		sortable: true,
    		pagination: true,
    		rowsPerPage: 10,
    		columnFilter: false,
    		scrollY: false,
    		css: false,
    		blocks: {
    			searchInput: false,
    			paginationButtons: false,
    			paginationRowCount: false
    		}
    	};

    	function change_chromosome() {
    		console.log(select_chromosome);
    		$$invalidate(13, start = select_chromosome["start"]);
    		$$invalidate(14, end = select_chromosome["end"]);
    	}

    	function calc(chrom, startpos, endpos) {
    		let _result = null;
    		let params = { startpos: 0, endpos: 200 };
    		params['startpos'] = parseInt(startpos);
    		params['endpos'] = parseInt(endpos);
    		selectElement = document.querySelector('#consensus');
    		consensus = selectElement.value;
    		selectElement = document.querySelector('#data_file');
    		data_file = selectElement.value;
    		selectElement = document.querySelector('#nni');
    		$$invalidate(15, NNI = selectElement.value);
    		console.log(NNI);
    		selectElement = document.querySelector('#subs_model');
    		subs_model = selectElement.value;
    		selectElement = document.querySelector('#opt_param');
    		opt_param = selectElement.value;
    		let highlighted_sample = [];
    		console.log("chrom id", chrom);
    		console.log("samples.length", samples.length);

    		let payload = {
    			chrom,
    			startpos: params['startpos'],
    			endpos: params['endpos'],
    			samples,
    			number_of_sample: samples.length,
    			consensus,
    			data_file,
    			nni: NNI,
    			subs_model,
    			opt_param
    		};

    		let url = 'http://127.0.0.1:8090' + '/phylo_cluster';

    		axios$1.post(url, payload).then(response => {
    			_result = response.data;
    			likelihood = _result.likelihood;
    			$$invalidate(11, passimory = _result.passimory);
    			$$invalidate(2, static_genotype_1 = _result.static_genotype_1);
    			$$invalidate(3, static_genotype_2 = _result.static_genotype_2);
    			$$invalidate(4, static_genotype_3 = _result.static_genotype_3);
    			$$invalidate(5, static_genotype_4 = _result.static_genotype_4);
    			$$invalidate(6, static_genotype_5 = _result.static_genotype_5);
    			$$invalidate(7, static_genotype_6 = _result.static_genotype_6);
    			$$invalidate(7, static_genotype_6 = _result.static_sequence);
    			$$invalidate(12, running_time = _result.running_time);
    			$$invalidate(8, phangorn_upgma = _result.phangorn_upgma);
    			static_vcf_data = _result.static_vcf_data;
    			$$invalidate(9, no_of_variants = _result.no_of_variants);
    			$$invalidate(10, Repeat_nni = _result.Repeat_nni);
    			console.log(_result.static_genotype_1["Model"][0]);
    			console.log(_result.static_genotype_1["Model"].length);
    			var newick = parse(_result.phylogenetic_result);
    			console.log(newick);
    			console.log(_result.phylogenetic_result);
    			var my_width = _result.number_of_sample * 20;
    			var my_height = _result.number_of_sample * 40;
    			const myNode = document.getElementById("phylogenetic_graph");
    			myNode.textContent = '';

    			Draw_Phylo('#phylogenetic_graph', newick, {
    				width: my_width,
    				height: my_height,
    				select_element: highlighted_sample
    			});
    		}).catch(error => {
    			console.log(error);
    		}); //self.raiseError('Error: Could not load any data from the server / backend.')
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Vcftophylogenetic> was created with unknown prop '${key}'`);
    	});

    	const click_handler = row => calc(chromosomes[row.seqid.match(/\d/g).join("") - 1]["id"], row.start, row.end);

    	function datatable_dataRows_binding(value) {
    		rows = value;
    		$$subscribe_rows($$invalidate(0, rows));
    	}

    	function select0_change_handler() {
    		select_chromosome = select_value(this);
    		$$invalidate(17, select_chromosome);
    		$$invalidate(16, chromosomes);
    	}

    	function input0_input_handler() {
    		start = this.value;
    		$$invalidate(13, start);
    	}

    	function input1_input_handler() {
    		end = this.value;
    		$$invalidate(14, end);
    	}

    	const click_handler_1 = () => calc(select_chromosome["id"], start, end);

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		context,
    		Datatable: Datatable_1,
    		PaginationButtons,
    		PaginationRowCount,
    		rows,
    		parse,
    		Draw_Phylo,
    		axios: axios$1,
    		DataFrame,
    		result,
    		static_genotype_1,
    		static_genotype_2,
    		static_genotype_3,
    		static_genotype_4,
    		static_genotype_5,
    		static_genotype_6,
    		static_sequence,
    		phangorn_upgma,
    		no_of_variants,
    		static_vcf_data,
    		Repeat_nni,
    		_dataframe,
    		samples,
    		likelihood,
    		passimory,
    		running_time,
    		start,
    		end,
    		selectElement,
    		consensus,
    		data_file,
    		NNI,
    		subs_model,
    		opt_param,
    		chromosomes,
    		chromosome,
    		select_chromosome,
    		datatableSettings,
    		change_chromosome,
    		calc,
    		highlighted_sample_list,
    		$rows
    	});

    	$$self.$inject_state = $$props => {
    		if ('rows' in $$props) $$subscribe_rows($$invalidate(0, rows = $$props.rows));
    		if ('result' in $$props) $$invalidate(1, result = $$props.result);
    		if ('static_genotype_1' in $$props) $$invalidate(2, static_genotype_1 = $$props.static_genotype_1);
    		if ('static_genotype_2' in $$props) $$invalidate(3, static_genotype_2 = $$props.static_genotype_2);
    		if ('static_genotype_3' in $$props) $$invalidate(4, static_genotype_3 = $$props.static_genotype_3);
    		if ('static_genotype_4' in $$props) $$invalidate(5, static_genotype_4 = $$props.static_genotype_4);
    		if ('static_genotype_5' in $$props) $$invalidate(6, static_genotype_5 = $$props.static_genotype_5);
    		if ('static_genotype_6' in $$props) $$invalidate(7, static_genotype_6 = $$props.static_genotype_6);
    		if ('static_sequence' in $$props) $$invalidate(19, static_sequence = $$props.static_sequence);
    		if ('phangorn_upgma' in $$props) $$invalidate(8, phangorn_upgma = $$props.phangorn_upgma);
    		if ('no_of_variants' in $$props) $$invalidate(9, no_of_variants = $$props.no_of_variants);
    		if ('static_vcf_data' in $$props) static_vcf_data = $$props.static_vcf_data;
    		if ('Repeat_nni' in $$props) $$invalidate(10, Repeat_nni = $$props.Repeat_nni);
    		if ('_dataframe' in $$props) _dataframe = $$props._dataframe;
    		if ('samples' in $$props) samples = $$props.samples;
    		if ('likelihood' in $$props) likelihood = $$props.likelihood;
    		if ('passimory' in $$props) $$invalidate(11, passimory = $$props.passimory);
    		if ('running_time' in $$props) $$invalidate(12, running_time = $$props.running_time);
    		if ('start' in $$props) $$invalidate(13, start = $$props.start);
    		if ('end' in $$props) $$invalidate(14, end = $$props.end);
    		if ('selectElement' in $$props) selectElement = $$props.selectElement;
    		if ('consensus' in $$props) consensus = $$props.consensus;
    		if ('data_file' in $$props) data_file = $$props.data_file;
    		if ('NNI' in $$props) $$invalidate(15, NNI = $$props.NNI);
    		if ('subs_model' in $$props) subs_model = $$props.subs_model;
    		if ('opt_param' in $$props) opt_param = $$props.opt_param;
    		if ('chromosomes' in $$props) $$invalidate(16, chromosomes = $$props.chromosomes);
    		if ('chromosome' in $$props) $$invalidate(23, chromosome = $$props.chromosome);
    		if ('select_chromosome' in $$props) $$invalidate(17, select_chromosome = $$props.select_chromosome);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		rows,
    		result,
    		static_genotype_1,
    		static_genotype_2,
    		static_genotype_3,
    		static_genotype_4,
    		static_genotype_5,
    		static_genotype_6,
    		phangorn_upgma,
    		no_of_variants,
    		Repeat_nni,
    		passimory,
    		running_time,
    		start,
    		end,
    		NNI,
    		chromosomes,
    		select_chromosome,
    		$rows,
    		static_sequence,
    		datatableSettings,
    		change_chromosome,
    		calc,
    		chromosome,
    		click_handler,
    		datatable_dataRows_binding,
    		select0_change_handler,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler_1
    	];
    }

    class Vcftophylogenetic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Vcftophylogenetic",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.54.0 */

    const { console: console_1 } = globals;

    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let div;
    	let phylogeneticdetails;
    	let current;
    	phylogeneticdetails = new Vcftophylogenetic({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(phylogeneticdetails.$$.fragment);
    			add_location(div, file, 16, 4, 502);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(phylogeneticdetails, div, null);
    			current = true;
    		},
    		p: noop$3,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(phylogeneticdetails.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(phylogeneticdetails.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(phylogeneticdetails);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	onMount(async () => {
    		console.log('DivBrowse App mounted!');
    		let script = document.createElement('script');
    		script.src = "http://d3js.org/d3.v3.min.js"; // TODO: manage this via NPM dependency
    		document.head.append(script);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		setContext,
    		getContext,
    		PhylogeneticDetails: Vcftophylogenetic
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    function startApp(containerId, config) {

        let _containerId = '#'+containerId;
        
        //let _config = JSON.parse(JSON.stringify(config));
        let _config = Object.assign({}, config);

        let app = new App({
            target: document.querySelector(_containerId),
            props: {
                config: _config,
                appId: 'divbrowse-'+containerId,
            }
        });
        return app;
    }

    exports.startApp = startApp;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=bundle.js.map
