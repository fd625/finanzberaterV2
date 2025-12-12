import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import MyButton from "../../src/components/My-Button.vue";

describe("MyButton Component", () => {
    it("renders properly with label", () => {
        const wrapper = mount(MyButton, {
            props: {
                label: "Click Me",
                color: "#417d41"
            }
        });

        expect(wrapper.text()).toContain("Click Me");
    });

    it("applies custom color style", () => {
        const testColor = "#ff0000";
        const wrapper = mount(MyButton, {
            props: {
                label: "Test",
                color: testColor
            }
        });

        const button = wrapper.find("button");
        const style = button.attributes("style");
        
        expect(style).toMatch(/background-color:\s*rgb\(255,\s*0,\s*0\)/);
    });

    it("emits clicked event when button is clicked", async () => {
        const wrapper = mount(MyButton, {
            props: {
                label: "Test",
                color: "#417d41"
            }
        });

        await wrapper.find("button").trigger("click");

        expect(wrapper.emitted()).toHaveProperty("clicked");
        expect(wrapper.emitted("clicked")).toHaveLength(1);
    });

    it("has correct CSS classes", () => {
        const wrapper = mount(MyButton, {
            props: {
                label: "Test",
                color: "#417d41"
            }
        });

        expect(wrapper.find("button").classes()).toContain("my-button");
    });
});