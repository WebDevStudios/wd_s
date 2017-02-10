<?php
/**
 * Add extra functionality to the customizer editor.
 *
 * @package _s
 */

if ( class_exists( 'WP_Customize_Control' ) ) :
	/**
	 * Class to create a custom text editor control
	 */
	class WDS_Text_Editor_Custom_Control extends WP_Customize_Control {
		/**
		 * Keep track of how many editors are added.
		 *
		 * @var integer
		 */
		protected static $count = 0;

		/**
		 * Render the content on the theme customizer page
		 *
		 * @return  void
		 */
		public function render_content() {
			?>
			<label>
				<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
				<span class="description customize-control-description"><?php echo esc_html( $this->description ); ?></span>
			</label>
			<div class="wds-customize-text-editor">
				<?php
				// setttings for the editor.
				$settings = array(
					'textarea_name' => $this->id,
					'textarea_rows' => 4,
					'media_buttons' => true,
				);

				// Add the editor.
				wp_editor( $this->value(), $this->id, $settings );

				// Only enqueue scripts once.
				if ( 0 === self::$count ) {
					$this->enqueue_scripts();
				}

				// Add the footer scripts.
				$this->add_footer_scripts();

				// Increment count.
				++self::$count;
				?>
			</div>
			<?php
		}

		/**
		 * Enqueue editor js.
		 *
		 * @return void
		 */
		protected function enqueue_scripts() {
			wp_enqueue_script( 'tiny_mce' );

			// Add customizer editor js.
			wp_enqueue_script( '_s-customize-editor-js', get_template_directory_uri() . '/inc/customizer/assets/scripts/editor.js', array( 'jquery' ), '1.0.0', true );
		}

		/**
		 * Add footer scripts for the tinymce.
		 *
		 * @return  void
		 */
		protected function add_footer_scripts() {
			do_action( 'admin_print_footer_scripts' );
		}
	}
endif;
