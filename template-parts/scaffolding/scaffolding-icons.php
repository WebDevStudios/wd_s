<?php
/**
 * The template used for displaying icons in the scaffolding library.
 *
 * @package _s
 */

namespace WD_S;

use WD_S\Functions as Functions;
use WD_S\Scaffolding as Scaffolding;

?>

<section class="section-scaffolding">

	<h2 class="scaffolding-heading"><?php esc_html_e( 'Icons', '_s' ); ?></h2>

	<?php
	// SVG Icon.
	Scaffolding\display_scaffolding_section(
		[
			'title'       => 'SVG',
			'description' => 'Display inline SVGs.',
			'usage'       => '<?php display_svg( array(
				\'icon\'   => \'facebook-square\',
				\'title\'  => \'Facebook Icon\',
				\'desc\'   => \'Facebook social icon svg\',
				\'height\' => \'50\',
				\'width\'  => \'50\',
				\'fill\'   => \'#20739a\',
			) ); ?>',
			'parameters'  => [
				'$args' => '(required) Configuration arguments.',
			],
			'arguments'   => [
				'icon'   => '(required) The SVG icon file name. Default none',
				'title'  => '(optional) The title of the icon. Default: none',
				'desc'   => '(optional) The description of the icon. Default: none',
				'fill'   => '(optional) The fill color of the icon. Default: none',
				'height' => '(optional) The height of the icon. Default: none',
				'width'  => '(optional) The width of the icon. Default: none',
			],
			'output'      => Functions\return_svg(
				[
					'icon'   => 'facebook-square',
					'title'  => 'Facebook Icon',
					'desc'   => 'Facebook social icon svg',
					'height' => '50',
					'width'  => '50',
					'fill'   => '#20739a',
				]
			),
		]
	);
	?>
</section>
