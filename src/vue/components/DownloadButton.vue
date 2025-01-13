<template>
	<a
		@click="downloadFile"
		rel="noopener noreferrer"
		class="button">
		<span class="button__text">{{ text }}</span>
		<span class="button__icon"
			><svg
				class="svg"
				data-name="Layer 2"
				id="bdd05811-e15d-428c-bb53-8661459f9307"
				viewBox="0 0 35 35"
				xmlns="http://www.w3.org/2000/svg">
				<path
					d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path>
				<path
					d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path>
				<path
					d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path>
			</svg>
		</span>
	</a>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const { text } = defineProps({
	text: { type: String, required: true }
});

const router = useRouter();

function downloadFile() {
	window.open('/cv', '_blank');
}
</script>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

.button {
	--main-focus: #2d8cf0;
	--font-color: #dedede;
	--bg-color-sub: #222;
	--bg-color: #323232;
	--main-color: #dedede;

	position: fixed;
	right: 1%;
	bottom: 2%;
	z-index: 100;
	width: 120px;
	height: 40px;
	cursor: pointer;
	display: flex;
	align-items: center;
	border: 2px solid var(--main-color);
	box-shadow: 4px 4px var(--main-color);
	background-color: var(--bg-color);
	border-radius: 10px;
	overflow: hidden;
	transition: all 0.3s;

	@include media-breakpoint-down($navigation-sidebar-breakpoint) {
		position: absolute;
		top: 12.5rem;
		right: 2%;
	}

	@include media-breakpoint-down(sm) {
		top: 0.5rem;
		right: 4rem;
		width: 50px;
		height: 28px;
		box-shadow: 0px 0px var(--main-color);
		border: none;
		background-color: transparent;

		.button__text {
			display: none;
		}

		.button__icon {
			background-color: transparent;
			width: 100%;
		}
	}

	&__text {
		transform: translateX(21px);
		color: var(--font-color);
		font-weight: 600;
		transition: all 0.3s;
	}

	&__icon {
		position: absolute;
		// transform: translateX(109px);
		right: 0;
		height: 100%;
		width: 39px;
		background-color: var(--bg-color-sub);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s;

		.svg {
			width: 20px;
			fill: var(--main-color);
		}
	}

	&:hover {
		background: var(--bg-color);

		.button__text {
			color: transparent;
		}

		.button__icon {
			width: 100%;
			// right: 10px;
			// transform: translateX(0);
		}
	}

	&:active {
		transform: translate(3px, 3px);
		box-shadow: 0px 0px var(--main-color);
	}
}
</style>
