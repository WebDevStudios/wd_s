<?php
/**
 * Enable multiple WYSIWYG editors in the theme customizer.
 *
 * @package _s
 */

if ( class_exists( 'WP_Customize_Control' ) ) :

	/**
	 * Class to create a custom text editor control
	 */
	class Text_Editor_Custom_Control extends WP_Customize_Control {

		/**
		 * Keep track of how many editors are added.
		 *
		 * @var $count
		 */
		protected static $count = 0;

		/**
		 * Render the content on the theme customizer page
		 */
		public function render_content() {
			?>
			<label>
				<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
				<span class="description customize-control-description"><?php echo esc_html( $this->description ); ?></span>
			</label>
			<div class="wds-customize-text-editor">
				<?php
				// Setttings for the editor.
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

				// add the footer scripts.
				$this->add_footer_scripts();

				// Increment count.
				++self::$count;
				?>
			</div>
			<?php
		}

		/**
		 * Enqueue scripts.
		 */
		protected function enqueue_scripts() {
			wp_enqueue_script( 'tiny_mce' );
			wp_enqueue_script( 'wds-customize-editor-js', get_template_directory_uri() . '/inc/customizer/assets/scripts/tinymce.js', array( 'jquery' ), '1.0.0', true );
		}

		/**
		 * Add footer scripts for Tinymce.
		 */
		protected function add_footer_scripts() {
			do_action( 'admin_print_footer_scripts' );
		}
	}
endif;
